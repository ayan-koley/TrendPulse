import type { FetchStatus, FetchType } from "../../models/platformFetchLogs.models.ts"
import type { ApiStatus, PlatformName } from "../../models/platforms.models.ts"
export type PlatformTypes = {
    platform_name: PlatformName,
    api_status: ApiStatus,
    rate_limit: number
    requests_used: number,
    last_fetched_at: Date,
    is_enabled: boolean,
    created_at: Date
}

export type UpdatePlatformPayload = Partial<{
    api_status: ApiStatus;
    rate_limit: number;
    requests_used: number;
    is_enabled: boolean;
}>

export type PlatformFetchLogs = {
    fetch_type: FetchType,
    records_fetched: number,
    status: FetchStatus,
    error_message?: string,
    duration_ms: number,
    fetched_at: Date
}