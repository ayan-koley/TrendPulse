import { integer, pgEnum, pgTable, varchar, text, numeric, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'
import { platformsTable } from './platforms.models.ts'

export const countries = ["US", "IN", "UK", "CA", "AU", "DE", "FR", "JP", "ES", "BR", "KR", "SA"] as const;

export type TrendCountry = (typeof countries)[number];

export const countryEnum = pgEnum('trend_country', countries);

export const trendsTable = pgTable('trends', {
    id: uuid('id').defaultRandom().primaryKey(),
    topic: varchar('topic', { length: 500 }).notNull(),
    category: varchar('category').notNull(),
    platform_id: uuid('platform_id').notNull().references(() => platformsTable.id),
    country: countryEnum('country').notNull(),
    language: varchar('language', { length: 50 }).notNull().default('en'),
    trend_score: integer('trend_score').notNull(),
    velocity_score: numeric('velocity_score', { precision: 5, scale: 2, mode: "number" }).notNull(), 
    sentiment_score: numeric('sentiment_score', { precision: 3, scale: 2, mode: "number" }).notNull(),
    engagement_count: integer('engagement_count').default(0).notNull(),
    post_count: integer('post_count').default(0).notNull(),
    rank_position: integer('rank_position').notNull(),
    rank_change: integer('rank_change').default(0), 
    related_hashtags: text('related_hashtags').array().default([]),
    is_active: boolean('is_active').default(true).notNull(),
    first_detected_at: timestamp('first_detected_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    last_updated_at: timestamp('last_updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
