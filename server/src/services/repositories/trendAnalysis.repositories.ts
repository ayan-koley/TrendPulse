import { and, desc, eq } from "drizzle-orm";
import { db } from "../../config/db.ts";
import { trendAnalyticsTable } from "../../models/trendAnalytics.models.ts";
import { platformsTable } from "../../models/platforms.models.ts";
import { trendsTable } from "../../models/trends.models.ts";

export type TrendAnalysis = {
    trend_id: string,
    platform_id: string,
    time_bucket: Date,
    hourly_growth?: number,
    daily_growth?: number,
    engagement_rate: number,
    viral_probability?: number,
    post_count: number,
    top_countries: string[],
    created_at: Date,
    trend_score: number,
    velocity_score: number
} 

const insertTrendAnalytics = async(trend: TrendAnalysis) => {
    try {
        const isValidPlatformId = await db.select({id: platformsTable}).from(platformsTable).where(eq(platformsTable.id, trend.platform_id));
        if(isValidPlatformId?.length === 0) {
            throw new Error("Invalid platform id");
        }

        const isValidTrendId = await db.select({id: trendsTable.id}).from(trendsTable).where(eq(trendsTable.id, trend.trend_id));
        if(isValidTrendId?.length === 0) {
            throw new Error("Invalid trend id");
        }

        return await db.insert(trendAnalyticsTable).values(trend);
    } catch (error: any) {
        throw new Error("ERROR on inserting data into trendAnalytics ", error.message);
    }
}

const lastSnapshotResult = async(platformId: string, trendId: string) => {
    if(!platformId) {
        throw new Error("Invalid platform id");
    }

    if(!trendId) {
        throw new Error("Invalid trend id");
    }

    const trendAnalysis = await db.select({postCount: trendAnalyticsTable.post_count, totalEngagement: trendAnalyticsTable.totalEngagement})
    .from(trendAnalyticsTable)
    .where(and(
        eq(trendAnalyticsTable.platform_id, platformId),
        eq(trendAnalyticsTable.trend_id, trendId)
    ))
    .orderBy(desc(trendAnalyticsTable.time_bucket))
    .limit(1);

    return trendAnalysis[0];
}

export {
    insertTrendAnalytics,
    lastSnapshotResult
}