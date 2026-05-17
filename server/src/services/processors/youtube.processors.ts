import { generateYoutubeTrendingVideos, type YoutubeResponse } from "../collectors/youtube.service.ts";
import { normalizeYouTube, type Hashtags, type NormalizedVideo, type TrendingTopics } from "../normalizers/youtube.normalizer.ts";
import type { PlatformFetchLogs } from '../../platforms/types/platform.types.ts'
import { insertTrendingTopic } from "../repositories/trendingTopic.repository.ts";
import { insertHashtags } from "../repositories/hashtags.repositories.ts";
import { insertPlatformFetchLogs } from "../repositories/platformFetchLogs.repositories.ts";
import { incrementPlatformRequestUsedById } from "../../platforms/updater/platform.updater.ts";
import { groupVideosByHashtags } from "../trend/groupVideosByHashtag.ts";
import { createTrendFromGroup } from "../trend/createTrendFromGroup.ts";

type NormalizedYoutubeData = {
//   trendingTopics: TrendingTopics;
    normalizedVideo: NormalizedVideo
    hashtagRows: Hashtags[];
};

export async function processTrendingVideos() {
    try {
        const startTime = Date.now();
        const youtubeResponse: YoutubeResponse = await generateYoutubeTrendingVideos();
        const endTime = Date.now();
        const normalizedRes: NormalizedYoutubeData[] = normalizeYouTube(youtubeResponse.items); 

        const videos: NormalizedVideo[] = normalizedRes.map(res => res.normalizedVideo);

        const groupedVideos: Map<string, NormalizedVideo[]> = groupVideosByHashtags(videos)

        const platformId = process.env.YOUTUBE_PLATFROM_ID;
        if(!platformId) {
            throw new Error("Platformid is undefined");
        }
        
        for(const [hashtag, groupVideos] of groupedVideos.entries()) {
            const trending: TrendingTopics = createTrendFromGroup(hashtag, groupVideos);    
            // save db te
            await insertTrendingTopic(platformId, trending)

        }
        
        const fetchDuration = endTime - startTime;
        // init fetchLogs
        const fetchLogs: PlatformFetchLogs = {
            fetch_type: "trending_topics",
            records_fetched: 50,
            duration_ms: fetchDuration,
            status: "success",
            fetched_at: new Date()
        }
        const logs = await insertPlatformFetchLogs(platformId, fetchLogs);

        await incrementPlatformRequestUsedById(platformId);

    } catch (e: any) {
        console.error('ERROR on youtube processors ', e.message);
    }
}