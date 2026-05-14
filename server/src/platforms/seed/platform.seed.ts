import { db } from "../../config/db.ts";
import { eq } from "drizzle-orm";
import { platformsTable } from "../../models/index.ts";
import type { PlatformTypes } from "../types/platform.types.ts";

export const seedPlatforms = async(platforms: PlatformTypes[]) => {
    try {   
        for (const platform of platforms) {
            const existingPlatform = await db
                .select({ id: platformsTable.id })
                .from(platformsTable)
                .where(eq(platformsTable.platform_name, platform.platform_name))
                .limit(1);

            if (existingPlatform.length === 0) {
                await db.insert(platformsTable).values(platform);
            }
        }
    } catch (error: any) {
        console.error("ERROR on seed platforms ", error.message);
    }
}