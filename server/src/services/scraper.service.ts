// src/services/scraper.service.ts
import { fetchTrendingYoutubeVideos } from '../apis/youtube.api.ts';
import { fetchTrendingRedditPosts } from '../apis/reddit.api.ts';
import type { ScrapedTrendPayload } from '../types/index.ts';

export async function fetchLatestRawScrapedData(): Promise<ScrapedTrendPayload[]> {
  const unifiedPayloads: ScrapedTrendPayload[] = [];

  try {
    // 🚀 FIRE ALL INDEPENDENT API CALLS PARALLELLY (Saves boot up latency)
    const [rawYoutube, rawReddit] = await Promise.allSettled([
      fetchTrendingYoutubeVideos(),
      fetchTrendingRedditPosts()
    ]);

    // ================= PURIFY YOUTUBE DATA =================
    if (rawYoutube.status === 'fulfilled' && rawYoutube.value?.items) {
      for (const video of rawYoutube.value.items) {
        // Extract numbers safely
        const viewCount = parseInt(video.statistics.viewCount || '0', 10);
        
        // Custom simple logic: Convert raw video strings to our uniform layout
        unifiedPayloads.push({
          topic: video.snippet.title,
          category: "Tech & Coding",
          summary: video.snippet.description?.slice(0, 150) || "Trending video discussion on YouTube.",
          metrics: {
            youtube: {
              trafficScore: Math.min(100, Math.round(viewCount / 50000)), // Normalization math anchor
              preferredFormat: video.snippet.title.toLowerCase().includes('short') ? "Short-Form" : "Long-Form",
              viewVelocityPerHour: Math.round(viewCount / 24) // Rough estimation framework
            }
          },
          aiSuggestions: {
            titleHooks: [`Is ${video.snippet.title} actually worth it?`],
            scriptHook: "[0-3s]: Highlight the trending topic from YouTube analytics."
          }
        });
      }
    }

    // ================= PURIFY REDDIT DATA =================
    if (rawReddit.status === 'fulfilled' && rawReddit.value?.data?.children) {
      for (const post of rawReddit.value.data.children) {
        const postData = post.data;
        
        // Simple extraction rule: Parse potential pain points from body text if available
        const potentialPainPoint = postData.selftext && postData.selftext.length > 10
          ? postData.selftext.slice(0, 100) + "..."
          : `Community inquiry raised regarding structural configuration implementation workflow.`;

        unifiedPayloads.push({
          topic: postData.title,
          category: "Tech & Coding",
          summary: `Hot discussion thread on r/${postData.subreddit} tracking community response parameters.`,
          metrics: {
            reddit: {
              trafficScore: Math.min(100, Math.round(postData.ups / 10)),
              activeSubreddits: [`r/${postData.subreddit}`],
              userPainPoints: [potentialPainPoint]
            }
          },
          aiSuggestions: {
            titleHooks: [`Reddit is losing it over: ${postData.title}`],
            scriptHook: `[0-5s]: Quote a top thread from r/${postData.subreddit}...`
          }
        });
      }
    }

  } catch (globalError) {
    console.error("⚠️ Critical collapse inside the Scraper Purifier core pipeline:", globalError);
  }

  return unifiedPayloads;
}