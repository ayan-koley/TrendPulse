import { generateYoutubeTrendingVideos, type YoutubeResponse } from "../collectors/youtube.service.ts";
import { normalizeYouTube, type Hashtags, type NormalizedVideo, type TrendingTopics } from "../normalizers/youtube.normalizer.ts";
import type { PlatformFetchLogs } from '../../platforms/types/platform.types.ts'
import { insertTrendingTopic, updateRankPositions, upsertTrendingTopic } from "../repositories/trendingTopic.repository.ts";
import { insertHashtags } from "../repositories/hashtags.repositories.ts";
import { insertPlatformFetchLogs } from "../repositories/platformFetchLogs.repositories.ts";
import { incrementPlatformRequestUsedById } from "../../platforms/updater/platform.updater.ts";
import { groupVideosByHashtags } from "../trend/groupVideosByHashtag.ts";
import { createTrendFromGroup } from "../trend/createTrendFromGroup.ts";
import { calculateMetrics } from "../trend/calculateMetrics.ts";
import { insertTrendAnalytics, type TrendAnalysis } from "../repositories/trendAnalysis.repositories.ts";
import { extractVirtualHashtags } from "../trend/keywordExtractor.ts";

type NormalizedYoutubeData = {
//   trendingTopics: TrendingTopics;
    normalizedVideo: NormalizedVideo
    hashtagRows: Hashtags[];
};

export async function processTrendingVideos() {
    const platformId: string = process.env.YOUTUBE_PLATFROM_ID!;
    if(!platformId) {
        throw new Error("Platformid is undefined");
    }
    try {
        const startTime = Date.now();
        const youtubeResponse: YoutubeResponse = await generateYoutubeTrendingVideos();
        const endTime = Date.now();
        const normalizedRes: NormalizedYoutubeData[] = normalizeYouTube(youtubeResponse.items); 

        let videos: NormalizedVideo[] = normalizedRes.map(res => res.normalizedVideo);

        videos = videos.map((video) => {
            if(!video.hashtags || video.hashtags.length === 0) {
                const fallbackTags = extractVirtualHashtags(video.title, video.description || "");
                return {
                    ...video,
                    hashtags: fallbackTags
                }
            }
            return video
        })

        const groupedVideos: Map<string, NormalizedVideo[]> = groupVideosByHashtags(videos)
        
        for(const [hashtag, groupVideos] of groupedVideos.entries()) {
            const metrics = calculateMetrics(groupVideos);
            const trending: TrendingTopics = createTrendFromGroup(hashtag, groupVideos, metrics);   
            // save db te
            const trend = await upsertTrendingTopic(platformId, trending)
            
            if(!trend || trend.length === 0) {
                console.warn(`Skipping analytics — no trend row for ${hashtag}`)
                continue;
            }

            await insertTrendAnalytics({
                platform_id: platformId,
                trend_id: trend[0].id,
                engagement_rate: metrics.engagementRate,
                post_count: metrics.postCount,
                time_bucket: new Date(),
                top_countries: metrics.topCountries,
                created_at: new Date(),
                trend_score: trend[0].trend_score
            })
        }

        await updateRankPositions(platformId);
        
        const fetchDuration = endTime - startTime;
        // init fetchLogs
        const fetchLogs: PlatformFetchLogs = {
            fetch_type: "trending_topics",
            records_fetched: 50,
            duration_ms: fetchDuration,
            status: "success",
            fetched_at: new Date()
        }
        await insertPlatformFetchLogs(platformId, fetchLogs);

        await incrementPlatformRequestUsedById(platformId);

    } catch (e: any) {
        const fetchLogs: PlatformFetchLogs = {
            fetch_type: "trending_topics",
            status: "failed",
            error_message: e.message,
            fetched_at: new Date()
        }
        await insertPlatformFetchLogs(platformId, fetchLogs);
        console.error('ERROR on youtube processors ', e.message);
    }
}