import { calculateTrendScore } from "../../utils/trendScore.utils.ts";
import type { NormalizedVideo } from "../normalizers/youtube.normalizer.ts";
import { type TrendingTopics } from "../normalizers/youtube.normalizer.ts";
import { calculateMetrics } from "./calculateMetrics.ts";

export const createTrendFromGroup = (hashtag: string, videos: NormalizedVideo[]) => {

    const metrics = calculateMetrics(videos);

    const engagementCount = metrics.engagementCount;
    const velocityScore = metrics.velocityScore;
    const sentimentScore = metrics.sentimentScore;
    const postCount = metrics.postCount;
    // console.log("typeof sentimental score ", typeof sentimentScore);

    const trendScore = calculateTrendScore({engagementCount, postCount, velocityScore});

    const realatedHashtag = [...new Set(videos.flatMap((video) => video.hashtags))].filter(tag => tag !== hashtag);

    const firstDetectedAt = new Date(
        Math.min(
            ...videos.map((video) => video.publishedAt.getTime())
        )
    )

    const trendingTopic: TrendingTopics = {
        topic: hashtag,
        category: metrics.topCategory[0],
        country: metrics.topCountries[0],
        language: metrics.topLanguages[0],
        trend_score: trendScore,
        velocity_score: velocityScore,
        sentiment_score: sentimentScore,
        engagement_count: engagementCount,
        post_count: postCount,
        rank_position: 0,
        rank_change: 0,
        related_hashtags: realatedHashtag,
        is_active: true,
        first_detected_at: firstDetectedAt,
        last_updated_at: new Date()
    }

    return trendingTopic;
}