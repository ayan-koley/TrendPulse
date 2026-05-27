import { asc, desc, eq, count } from "drizzle-orm";
import { db } from "../../config/db.js";
import { trendsTable } from "../../models/trends.models.ts";
import { trendAnalyticsTable } from "../../models/trendAnalytics.models.ts";
import { console } from "inspector/promises";
import { platformsTable } from "../../models/platforms.models.ts";

const getDashboardOverviewStats = async() => {
    try {
        const YOUTUBE_PLATFORM_ID = process.env.YOUTUBE_PLATFORM_ID!;
        // total trends
        const totalTrends = await db.select({id: trendsTable.id}).from(trendsTable);
        // active trends
        const activeTrends = await db.select({id: trendsTable.id}).from(trendsTable).where(eq(trendsTable.is_active, true));
        // top platform
        const totalYoutubeEngagement = await db.select({ count: count() }).from(trendsTable).where(eq(trendsTable.platform_id, YOUTUBE_PLATFORM_ID));
        // TODO:
        // fastest growing trend
        return {
            totalTrends: totalTrends.length,
            activeTrends: activeTrends.length,
            topPlatform: "youtube"
        }

    } catch (error: any) {
        console.log("ERROR on get overview stats of dashboard ", error.message);
    }
}

const getSparklineData = async(trendId: string): Promise<number[]> => {
    try {
        const result = await db.select(
            {
                engagementRate: trendAnalyticsTable.engagement_rate,
                totalEngagement: trendAnalyticsTable.totalEngagement,
                velocityScore: trendAnalyticsTable.velocity_score
            }
        ).from(trendAnalyticsTable)
        .where(eq(trendAnalyticsTable.trend_id, trendId))
        .orderBy(desc(trendAnalyticsTable.created_at))
        .limit(10);

        const sparkline = result.reverse().map(r => r.velocityScore);

        while(sparkline.length < 10) {
            sparkline.unshift(sparkline[0] || 0);
        }
        return sparkline;
    } catch (error: any) {
        console.log("ERROR on get sparkline data of dashboard ", error.message);
        throw error;
    }
    
}

const getTopTrendsForDashboard = async () => {
    try {
        const topTrends = await db.select(
            {
                id: trendsTable.id,
                topic: trendsTable.topic,
                category: trendsTable.category,
                platform_id: trendsTable.platform_id,
                country: trendsTable.country,
                language: trendsTable.language,
                trend_score: trendsTable.trend_score,
                velocity_score: trendsTable.velocity_score,
                sentiment_score: trendsTable.sentiment_score,
                engagement_count: trendsTable.engagement_count,
                post_count: trendsTable.post_count,
                rank_position: trendsTable.rank_position,
                rank_change: trendsTable.rank_change,
                related_hashtags: trendsTable.related_hashtags,
                is_active: trendsTable.is_active,
                first_detected_at: trendsTable.first_detected_at,
                last_updated_at: trendsTable.last_updated_at,

                platform: platformsTable.platform_name
            }
        ).from(trendsTable)
        .innerJoin(
            platformsTable,
            eq(trendsTable.platform_id, platformsTable.id)
        )
        .where(eq(trendsTable.is_active, true))
        .orderBy(asc(trendsTable.rank_position)).limit(20);
        
        return topTrends;
    } catch (error: any) {
        console.log("ERROR on get top trends for dashboard ", error.message);
    }
}

export {
    getDashboardOverviewStats,
    getSparklineData,
    getTopTrendsForDashboard
}