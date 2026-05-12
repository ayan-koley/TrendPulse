import { numeric, pgTable, timestamp, uuid, integer, text } from 'drizzle-orm/pg-core'
import { trendsTable } from './index.ts'

export const trendAnalyticsTable = pgTable('trend_analytics', {
    id: uuid('id').defaultRandom().primaryKey(),
    trend_id: uuid('trend_id').notNull().references(() => trendsTable.id),
    time_bucket: timestamp('time_bucket', { mode: 'date', withTimezone: true }).notNull(),
    hourly_growth: numeric('hourly_growth', { precision: 5, scale: 2 }).notNull(), 
    daily_growth: numeric('daily_growth', { precision: 5, scale: 2 }).notNull(), 
    engagement_rate: numeric('engagement_rate', { precision: 5, scale: 2 }).notNull(),
    viral_probability: numeric('viral_probability', { precision: 3, scale: 2 }).notNull(), 
    post_count: integer('post_count').default(0).notNull(),
    top_countries: text('top_countries').array().default([]),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
