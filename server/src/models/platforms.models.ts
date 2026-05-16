import { integer, pgEnum, pgTable, boolean, timestamp, uuid } from 'drizzle-orm/pg-core'

export const platformNames = ["youtube", "reddit", "twitter", "instagram"] as const;
export const apiStatuses = ["active", "limited", "down"] as const;

export type PlatformName = (typeof platformNames)[number];
export type ApiStatus = (typeof apiStatuses)[number];

export const platformNameEnum = pgEnum('platform_name', platformNames);
export const apiStatusEnum = pgEnum('api_status', apiStatuses);

export const platformsTable = pgTable('platforms', {
    id: uuid('id').defaultRandom().primaryKey(),
    platform_name: platformNameEnum('platform_name').notNull().unique(),
    api_status: apiStatusEnum('api_status').default('active').notNull(),
    rate_limit: integer('rate_limit').notNull(), 
    requests_used: integer('requests_used').default(0).notNull(),
    last_fetched_at: timestamp('last_fetched_at', { mode: 'date', withTimezone: true }),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
