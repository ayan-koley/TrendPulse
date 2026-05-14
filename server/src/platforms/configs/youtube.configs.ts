import type { PlatformTypes } from "../types/platform.types.ts"; 

export const youtubePlatform: PlatformTypes = {
    platform_name: "youtube",
    api_status: "active",
    rate_limit: 10000,
    requests_used: 0,
    last_fetched_at: new Date(),
    is_enabled: true,
    created_at: new Date()
}