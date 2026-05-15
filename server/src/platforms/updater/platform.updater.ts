import { db } from "../../config/db.ts";
import { eq, sql } from "drizzle-orm";
import { platformsTable } from "../../models/platforms.models.ts";
import type { UpdatePlatformPayload } from "../types/platform.types.ts";

const updatePlatformById = async(
    platformId: string,
    platform: UpdatePlatformPayload
) => {
    try {
        if(Object.keys(platform).length === 0) {
            throw new Error("At least one field is required");
        }

        return await db.update(platformsTable)
                        .set(platform)
                        .where(eq(platformsTable.id, platformId));
    } catch (e: any) {
        console.error("ERROR on update platform by id ", e.message);
        throw e;
    }
}

const incrementPlatformRequestUsedById = async(platformId: string) => {
    try {
        return await db.update(platformsTable).set({
            requests_used: sql`${platformsTable.requests_used} + 1`
        }).where(eq(platformsTable.id, platformId));
    } catch (error: any) {
        console.error("ERROR on increment request used ", error.message);
    }
}

export {
    updatePlatformById,
    incrementPlatformRequestUsedById
}