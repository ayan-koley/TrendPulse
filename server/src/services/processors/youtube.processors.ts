import { generateTrendingVideos, type YoutubeResponse } from "../collectors/youtube.service.ts";
import { normalizeYouTube, type Hashtags, type TrendingTopics } from "../normalizers/youtube.normalizer.ts";

type NormalizedYoutubeData = {
  trendingTopics: TrendingTopics;
  hashtagRows: Hashtags[];
};

export async function processTrendingVideos() {
    try {
        const response: YoutubeResponse = await generateTrendingVideos();
        const normalized: NormalizedYoutubeData[] = response.items.map(item => normalizeYouTube(item));
        
    } catch (e: any) {
        console.error('ERROR on youtube processors ', e.message);
    }
}