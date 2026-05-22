import { db } from "../../config/db.ts";
import { eq } from "drizzle-orm";
import { hashtagsTable, trendHashtags, trendsTable } from "../../models/index.ts";

const createTrendHashtags = async(trendId: string, hashtagId: string) => {
    try {
        const isValidTrensdId = await db.select({id: trendsTable.id}).from(trendsTable).where(eq(trendsTable.id, trendId));
        
        if(isValidTrensdId.length === 0) {
            throw new Error("Send a valid trends id to creating trending hashtags");
        }

        const isValidHashtagId = await db.select({id: hashtagsTable.id}).from(hashtagsTable).where(eq(hashtagsTable.id, hashtagId));
        
        if(isValidHashtagId.length === 0) {
            throw new Error("Send a valid hashtag id to creating trending hashtags");
        }

        return await db.insert(trendHashtags).values({
            trend_id: isValidTrensdId[0].id,
            hashtag_id: isValidHashtagId[0].id,
            created_at: new Date()
        })

    } catch (error: any) {
        console.error("ERROR on creating trending hashtags ", error.message);
    }
}

export {
    createTrendHashtags
}