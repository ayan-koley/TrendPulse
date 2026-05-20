import { desc, eq } from "drizzle-orm";
import { db } from "../../config/db.ts";
import { platformsTable } from "../../models/platforms.models.ts";
import { trendsTable } from "../../models/trends.models.ts";
import type { TrendingTopics } from "../normalizers/youtube.normalizer.ts";
// 1. Topic already exist karta hai?


// 2. Naya topic insert karo
const insertTrendingTopic = async(platformId: string, trending: TrendingTopics) => {
    try {
        const isValidPlatformId = await db.select({id: platformsTable.id}).from(platformsTable).where(eq(platformsTable.id, platformId));

        if(isValidPlatformId.length === 0) {
            throw new Error("Send a valid platfromId on inserting trending topics");
        }
        return await db.insert(trendsTable).values({
            platform_id: isValidPlatformId[0].id,
            ...trending,
        }).returning({id: trendsTable.id, trend_score: trendsTable.trend_score});
    } catch (error: any) {
        // console.log("ERROR payload ", trending);
        // console.error("ERROR on inserting trending topics ", error.message);
        console.error("FULL ERROR:", error);
    }
}

// 3. Platform ke saare active topics rank ke order mein lo
const getActiveTopicsByPlatform = async(platformId: string) => {
    try {
        const isValidPlatformId = await db.select({id: platformsTable.id}).from(platformsTable).where(eq(platformsTable.id, platformId));

        if(isValidPlatformId.length === 0) {
            throw new Error("Send a valid platfromId on inserting trending topics")
        }

        // const topics = await db.select({id: trendsTable.id, topic: trendsTable.topic, engagement_count: trendsTable.engagement_count, rank_position: trendsTable.rank_position}).from(trendsTable).where(eq(trendsTable.is_active, true)).orderBy(desc(trendsTable.trend_score)).limit(50);
        
        const topics = await db.select().from(trendsTable).where(eq(trendsTable.is_active, true)).orderBy(desc(trendsTable.trend_score)).limit(50);

        return topics;
    } catch (error: any) {
        console.error("ERROR on fetching active topic from trending topics ", error.message);
    }
}

export {
    insertTrendingTopic,
    getActiveTopicsByPlatform
}