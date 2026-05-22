import { integer, pgEnum, pgTable, varchar, timestamp, uuid, text } from 'drizzle-orm/pg-core'
import { platformsTable } from './index.ts'

const fetchTypes = ["trending_topics", "hashtags"] as const;
const fetchStatuses = ["success", "failed", "partial"] as const;

export type FetchType = (typeof fetchTypes)[number];
export type FetchStatus = (typeof fetchStatuses)[number];

export const fetchTypeEnum = pgEnum('fetch_type', fetchTypes);
export const fetchStatusEnum = pgEnum('fetch_status', fetchStatuses);

export const platformFetchLogsTable = pgTable('platform_fetch_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    platform_id: uuid('platform_id').notNull().references(() => platformsTable.id),
    fetch_type: fetchTypeEnum('fetch_type').notNull(),
    records_fetched: integer('records_fetched').default(0),
    status: fetchStatusEnum('status').notNull(),
    error_message: text('error_message'),
    duration_ms: integer('duration_ms'),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
