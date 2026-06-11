import { eq } from 'drizzle-orm';
import { db } from '../config/db.ts';
import { trendsTable } from '../models/trends.models.ts';
import { fetchLatestRawScrapedData } from '../services/scraper.service.ts';
import { findExistingDuplicate } from '../services/deduplication.service.ts';
import { calculateOverallTrendScore } from '../services/scoreCalculator.service.ts';
import type { HistoricalGraphNode, PlatformDataBucket } from '../types/index.ts';

export async function runTrendIngestionJob(): Promise<void> {
  console.log('⏰ Starting cron ingestion job execution layer...');
  
  try {
    // 1. Fetch live metadata indexes from db for cross-comparisons verification
    const existingActiveTopics = await db
      .select({
        id: trendsTable.id,
        topic: trendsTable.topic,
        historical_graph_data: trendsTable.historical_graph_data,
        metrics: trendsTable.metrics
      })
      .from(trendsTable);

    // 2. Fire external data collector trigger layer logic
    const rawScrapedTrends = await fetchLatestRawScrapedData();
    console.log("📊 Fetched latest raw scraped data batch. Total records: ", rawScrapedTrends[1]);

    for (const rawTrend of rawScrapedTrends) {
      // 3. Process records through standard duplicate scanner pipeline matching
      const duplicateId = findExistingDuplicate(rawTrend.topic, existingActiveTopics);
      
      // 4. Transform scores payload formatting blocks safely
      const scoreInput = {
        youtubeScore: rawTrend.metrics.youtube?.trafficScore || 0,
        twitterScore: rawTrend.metrics.twitter?.trafficScore || 0,
        redditScore: rawTrend.metrics.reddit?.trafficScore || 0,
        instagramScore: rawTrend.metrics.instagram?.trafficScore || 0,
        viewVelocity: rawTrend.metrics.youtube?.viewVelocityPerHour || 0
      };
      
      const { score: computedScore, status: computedStatus } = calculateOverallTrendScore(scoreInput);
      const currentTimeISO = new Date().toISOString();

      const newGraphNode: HistoricalGraphNode = {
            timestamp: currentTimeISO,
            score: computedScore,
            youtube_volume: rawTrend.metrics.youtube?.viewVelocityPerHour || 0,
            twitter_volume: (rawTrend.metrics.twitter?.trafficScore || 0) * 30, // Mocking volume scale factor
            instagram_volume: (rawTrend.metrics.instagram?.trafficScore || 0) * 10,
            reddit_volume: (rawTrend.metrics.reddit?.trafficScore || 0) * 15
        };

      if (duplicateId) {
        // =============== SCENARIO A: UPDATE CONFIRMED DUPLICATE RECORD ===============
  
        const targetRecord = existingActiveTopics.find(r => r.id === duplicateId);
        const pastGraph = targetRecord?.historical_graph_data as HistoricalGraphNode[] || [];
        
        // 🌟 PREVENT OVERWRITE BUG: Safely pull existing records and append incoming specific node metrics
        const existingPlatformData = targetRecord?.metrics as PlatformDataBucket || {};

        await db.update(trendsTable)
            .set({
            overall_trend_score: computedScore,
            status: computedStatus,
            
            // ✅ MAGICAL FIX: Merges existing JSON structures so 'youtube' metrics don't erase 'reddit' fields!
            metrics: { 
                ...existingPlatformData, 
                ...rawTrend.metrics 
            },
            
            historical_graph_data: [...pastGraph, newGraphNode], 
            last_updated_at: new Date()
            })
            .where(eq(trendsTable.id, duplicateId));

      } else {
        // =============== SCENARIO B: INSERT RECOGNIZED BRAND NEW RECORD ===============

        const ytVelocity = rawTrend.metrics.youtube?.viewVelocityPerHour || 0;
        const redditScore = rawTrend.metrics.reddit?.trafficScore || 0;
        const twitterScore = rawTrend.metrics.twitter?.trafficScore || 0;
        const instagramScore = rawTrend.metrics.instagram?.trafficScore || 0;

        const newGraphNode: HistoricalGraphNode = {
            timestamp: currentTimeISO,
            score: computedScore,
            
            youtube_volume: ytVelocity,
            reddit_volume: redditScore * 15,
            twitter_volume: twitterScore * 30,
            instagram_volume: instagramScore * 10
        };

        await db.insert(trendsTable).values({
          topic: rawTrend.topic.replace(/[!]/g, '').trim(), 
          category: rawTrend.category,
          overall_trend_score: computedScore,
          status: computedStatus,
          metrics: rawTrend.metrics,
          historical_graph_data: [newGraphNode],
          ai_suggestions: rawTrend.aiSuggestions,
        });
      }
    }
    
    console.log('✅ Cron ingestion execution loop processed successfully.');
  } catch (error) {
    console.error('❌ Critical crash on cron background worker service thread:', error);
  }
}

