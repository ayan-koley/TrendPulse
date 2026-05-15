import { integer, pgEnum, pgTable, varchar, numeric, timestamp, uuid, text } from 'drizzle-orm/pg-core'
import { countryEnum } from './trends.models.ts'
import { platformsTable } from './platforms.models.ts'

const velocities = ["rising", "peaking", "declining"] as const;

export type Velocity = (typeof velocities)[number];

export const velocityEnum = pgEnum('hashtag_velocity', velocities);

export const hashtagsTable = pgTable('hashtags', {
    id: uuid('id').defaultRandom().primaryKey(),
    hashtag: varchar('hashtag', { length: 255 }).notNull(),
    platform_id: uuid('platform_id').notNull().references(() => platformsTable.id),
    usage_count: integer('usage_count').default(0).notNull(),
    engagement_score: numeric('engagement_score', { precision: 3, scale: 2, mode: "number" }).notNull(),
    growth_rate: numeric('growth_rate', { precision: 5, scale: 2, mode: "number" }).default(0),
    velocity: velocityEnum('velocity').notNull(),
    country: countryEnum('country').notNull(),
    related_hashtags: text('related_hashtags').array().default([]),
    first_detected_at: timestamp('first_detected_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    last_updated_at: timestamp('last_updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
