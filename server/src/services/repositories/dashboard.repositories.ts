import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { trendsTable } from "../../models/trends.models.ts";
import { trendAnalyticsTable } from "../../models/trendAnalytics.models.ts";
import { console } from "inspector/promises";

const getDashboardOverviewStats = async() => {
    try {
        const YOUTUBE_PLATFORM_ID = process.env.YOUTUBE_PLATFROM_ID!;
        // total trends
        const totalTrends = await db.select({id: trendsTable.id}).from(trendsTable);
        // active trends
        const activeTrends = await db.select({id: trendsTable.id}).from(trendsTable).where(eq(trendsTable.is_active, true));
        // top platform
        const totalYoutubeEngagement = await db.select({id: trendsTable.id}).from(trendsTable).where(eq(trendsTable.platform_id, YOUTUBE_PLATFORM_ID));
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
            }
        ).from(trendAnalyticsTable)
        .where(eq(trendAnalyticsTable.trend_id, trendId))
        .orderBy(desc(trendAnalyticsTable.created_at))
        .limit(10);

        const sparkline = result.reverse().map(r => r.engagementRate);

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
        const topTrends = await db.select().from(trendsTable).where(eq(trendsTable.is_active, true)).orderBy(asc(trendsTable.rank_position)).limit(20);
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