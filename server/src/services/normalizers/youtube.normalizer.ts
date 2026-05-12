import { calculateEngagement } from "../../utils/engagement.utils.ts";
import { cleanHashtags } from "../../utils/hashtags.utils.ts";
import { calculateSentimentScore } from "../../utils/sentiment.utils.ts";
import { calculateTrendScore } from "../../utils/trendScore.utils.ts";
import { calculateVelocityScore } from "../../utils/velocityScore.utils.ts";
import { getYoutubeCategory, getYoutubeCountry } from "../../utils/youtube.utils.ts";
import type { Item } from "../collectors/youtube.service.ts";


export type TrendingTopics = {
    topic: string;
    category: string;
    platform_id: null;
    country: string;
    language: string;
    trend_score: number;
    velocity_score: number;
    sentiment_score: number;
    engagement_count: number;
    post_count: number;
    rank_position: number | null;
    rank_change: number;
    related_hashtags: string[];
    is_active: boolean;
    first_detected_at: Date;
    last_updated_at: Date;
}

export type Hashtags = {
    hashtag: string,
    platform_id: null,
    usage_count: number,
    engagement_score: number,
    growth_rate: number
    velocity: string,
    country: string,
    related_hashtags: string[],
    first_detected_at: Date,
    last_updated_at: Date
}

export function normalizeYouTube(item: Item) {
    const { id, snippet, statistics } = item;

    const lang = snippet.defaultLanguage || snippet.defaultAudioLanguage || "en";
    const views: number = parseInt(statistics.viewCount, 10) || 0;
    const likes: number = parseInt(statistics.likeCount, 10) || 0;
    const comments: number = parseInt(statistics.commentCount, 10) || 0;

    const engagement: number = calculateEngagement(views, likes, comments);
    const hashtags: string[] = cleanHashtags(snippet.tags || []);

    const trendingTopics: TrendingTopics = {
        topic: snippet.title,
        category: getYoutubeCategory(snippet.categoryId),
        platform_id: null,
        country: getYoutubeCountry(lang),
        language: lang,
        trend_score: calculateTrendScore(engagement),
        velocity_score: calculateVelocityScore(snippet.publishedAt),
        sentiment_score: calculateSentimentScore(snippet.title),
        engagement_count: engagement,
        post_count: 1,
        rank_position: null,
        rank_change: 0,
        related_hashtags: hashtags,
        is_active: true,
        first_detected_at: new Date(snippet.publishedAt),
        last_updated_at: new Date()
    }

    const hashtagRows: Hashtags[] = hashtags.map((tag) => ({
        hashtag: tag,  
        platform_id: null,
        usage_count: 1,
        engagement_score: parseFloat(
            (engagement / hashtags.length).toFixed(4)
        ),
        growth_rate: 0.00,
        velocity: 'rising',
        country: getYoutubeCountry(lang),
        related_hashtags: hashtags.filter(h => h !== tag).slice(0, 5),
        first_detected_at: new Date(snippet.publishedAt),
        last_updated_at: new Date()
    }))

    return { trendingTopics, hashtagRows }
}

