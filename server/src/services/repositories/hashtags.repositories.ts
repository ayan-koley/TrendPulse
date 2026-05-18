import { eq } from "drizzle-orm";
import { db } from "../../config/db.ts";
import type { Hashtags } from "../normalizers/youtube.normalizer.ts";
import { platformsTable } from "../../models/platforms.models.ts";
import { hashtagsTable } from "../../models/hashtags.models.ts";

const insertHashtags = async(platformId: string, hashtag: Hashtags) => {
    try {
        const isValidPlatformId = await db.select({id: platformsTable.id}).from(platformsTable).where(eq(platformsTable.id, platformId));

        if(isValidPlatformId.length === 0) {
            throw new Error("Send a valid platfromId on inserting trending topics");
        }

        return await db.insert(hashtagsTable).values({platform_id: isValidPlatformId[0].id, ...hashtag});
    } catch (error: any) {
        console.log("Hashtags - ", hashtag);
        console.error("ERROR on inserting hashtsgs ", error.message);
    }
}

export {
    insertHashtags
}