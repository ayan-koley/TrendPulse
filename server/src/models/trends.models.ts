import { integer, pgEnum, pgTable, varchar, text, numeric, timestamp, uuid, boolean, unique, jsonb } from 'drizzle-orm/pg-core'
import { platformsTable } from './platforms.models.ts'
import type { AISuggestionsPayload, HistoricalGraphNode, PlatformDataBucket } from '../types/index.ts';

export const countries = ["US", "IN", "UK", "CA", "AU", "DE", "FR", "JP", "ES", "BR", "KR", "SA"] as const;

export type TrendCountry = (typeof countries)[number];

export const countryEnum = pgEnum('trend_country', countries);

export const trendsTable = pgTable('trends', {
    id: uuid('id').defaultRandom().primaryKey(),
    topic: varchar('topic', { length: 500 }).notNull(),
    category: varchar('category').notNull(),
    // country: countryEnum('country'),
    overall_trend_score: numeric('overall_trend_score', { precision: 5, scale: 2, mode: "number" }).notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    metrics: jsonb('metrics').$type<PlatformDataBucket>().default({}).notNull(),
    historical_graph_data: jsonb('historical_graph_data').$type<HistoricalGraphNode[]>().default([]).notNull(),
    ai_suggestions: jsonb('ai_suggestions').$type<AISuggestionsPayload>().default({ titleHooks: [], scriptHook: '' }).notNull(),
    is_active: boolean('is_active').default(true).notNull(),
    first_detected_at: timestamp('first_detected_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    last_updated_at: timestamp('last_updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
},)
