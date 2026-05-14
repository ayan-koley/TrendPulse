import { db } from "../../config/db.ts";
import { eq } from "drizzle-orm";
import { platformsTable } from "../../models/platforms.models.ts";
import type { UpdatePlatformPayload } from "../types/platform.types.ts";

export const updatePlatformById = async(
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