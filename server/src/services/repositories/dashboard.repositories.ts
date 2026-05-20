import { eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { trendsTable } from "../../models/trends.models.ts";

const getOverviewStats = async() => {
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

export {
    getOverviewStats
}