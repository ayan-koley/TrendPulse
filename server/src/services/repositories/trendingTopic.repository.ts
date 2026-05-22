import { and, desc, eq, sql } from "drizzle-orm";
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

const upsertTrendingTopic = async(platformId: string,
  trending: TrendingTopics) => {
    try {
        const isValidPlatformId = await db.select({id: platformsTable.id}).from(platformsTable).where(eq(platformsTable.id, platformId));

        if(isValidPlatformId.length === 0) {
            throw new Error("Send a valid platfromId on inserting trending topics");
        }
        
        const result = await db
                        .insert(trendsTable)
                        .values({
                            platform_id: isValidPlatformId[0].id,
                            ...trending,
                        })
                        .onConflictDoUpdate({
                            target: [trendsTable.platform_id, trendsTable.topic],
                            set: {
                                trend_score: sql`EXCLUDED.trend_score`,
                                engagement_count: sql`EXCLUDED.engagement_count`,
                                post_count: sql`EXCLUDED.post_count`,
                                country: sql`EXCLUDED.country`,
                                is_active:  true,
                                last_updated_at:    sql`NOW()`,
                            },
                        }).returning()

        return result;
    } catch (error: any) {
        console.error("ERROR cause on upser ", error.cause);
    }
}

const updateRankPositions = async(platformId: string): Promise<void> => {
    try {
        await db.execute(sql`
            UPDATE trends AS t
            SET 
                rank_change = COALESCE(t.rank_position, new_ranks.new_rank) - new_ranks.new_rank,
                rank_position = new_ranks.new_rank,
                last_updated_at = NOW()
            FROM(
                SELECT
                id,
                ROW_NUMBER() OVER(
                    PARTITION  BY platform_id
                    ORDER BY trend_score DESC
                ) AS new_rank
                FROM trends
                WHERE platform_id = ${platformId}
                AND is_active = true
            ) AS new_ranks
            WHERE t.id = new_ranks.id
            AND t.platform_id = ${platformId}
            `)

    } catch (error: any) {
        console.error("ERROR on update the rank ", error.cause);
    }
}

const getTrendsByPlatform = async(platformId: string, limit: number = 50) => {
    try {
        return await db.select().from(trendsTable).where(
            and(
                eq(trendsTable.platform_id, platformId),
                eq(trendsTable.is_active, true)
            )
        ).orderBy(trendsTable.rank_position)
        .limit(limit)
    } catch (error: any) {
        console.error("ERROR on fetching trends by platform ", error.cause);
    }
}

export {
    insertTrendingTopic,
    getActiveTopicsByPlatform,
    updateRankPositions,
    upsertTrendingTopic,
    getTrendsByPlatform
}