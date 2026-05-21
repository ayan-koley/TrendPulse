import { db } from "../../config/db.ts";
import { eq } from "drizzle-orm";
import type { PlatformFetchLogs } from "../../platforms/types/platform.types.ts";
import { platformsTable } from "../../models/platforms.models.ts";
import { platformFetchLogsTable } from "../../models/index.ts";

const insertPlatformFetchLogs = async(platformId: string, fetchLogs: PlatformFetchLogs) => {
    try {
        const isValidPlatformId = await db.select({id: platformsTable.id}).from(platformsTable).where(eq(platformsTable.id, platformId));
        
        if(isValidPlatformId.length === 0) {
            throw new Error("Send a valid platfromId on inserting trending topics");
        }

        return await db.insert(platformFetchLogsTable).values({platform_id: isValidPlatformId[0].id, ...fetchLogs});
    } catch (error: any) {
        console.error("ERROR on inserting platfrom fetch lgos ", error.message);
        throw error;
    }
}

export {
    insertPlatformFetchLogs
}