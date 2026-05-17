import type { TrendCountry } from "../../models/trends.models.ts";
import { calculateEngagementRate } from "../../utils/engagement.utils.ts";
import { calculateSentimentScore } from "../../utils/sentiment.utils.ts";
import { calculateVelocityScore } from "../../utils/velocityScore.utils.ts";
import type { NormalizedVideo } from "../normalizers/youtube.normalizer.ts";

export type TrendMetrics = {
    postCount: number;
    engagementCount: number;
    engagementRate: number;
    topCountries: TrendCountry[];
    topLanguages: string[];
    topCategory: string[];
    velocityScore: number;
    sentimentScore: number;
}

export const calculateMetrics = (videos: NormalizedVideo[]): TrendMetrics => {
    // total post
    const postCount = videos.length;
    // total engagement
    const engagementCount = videos.reduce((sum, video) => {
        return sum + video.engagement
    }, 0)
    // total views
    const totalViews = videos.reduce((sum, video) => {
        return sum + video.views
    }, 0)
    const engagementRate = calculateEngagementRate(totalViews, engagementCount);


    const languageMap: Map<string, number> = new Map();
    const countryMap: Map<TrendCountry, number> = new Map();
    const categoryMap: Map<string, number> = new Map();
    let velocityScore: number =  0.00;
    let sentimentScore: number = 0.00;

    for(const video of videos) {
        languageMap.set(video.lang, (languageMap.get(video.lang) || 0) + 1);
        countryMap.set(video.country, (countryMap.get(video.country) || 0) + 1);
        categoryMap.set(video.category, (categoryMap.get(video.category) || 0) + 1);  
        
        // velocity score calculation
        velocityScore = velocityScore + calculateVelocityScore(String(video.publishedAt));
        // calculate sentiment score
        sentimentScore = sentimentScore + calculateSentimentScore(video.title);

    }
    const topLanguages = [...languageMap.entries()].sort((a, b) => b[1] - a[1]).map(([language]) => language);
    const topCountries = [...countryMap.entries()].sort((a, b) => b[1] - a[1]).map(([country]) => country);
    const topCategory = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]).map(([category]) => category);

    return {
        postCount,
        engagementCount,
        engagementRate,
        topCountries,
        topLanguages,
        topCategory,
        velocityScore: +(velocityScore / postCount).toFixed(2),
        sentimentScore: +(sentimentScore / postCount).toFixed(2)
    }
}