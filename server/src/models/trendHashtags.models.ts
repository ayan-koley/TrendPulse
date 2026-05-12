import { uuid, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { trendsTable,hashtagsTable } from './index.ts';

export const trendHashtags = pgTable('trend_hashtags', {
    id: uuid('id').defaultRandom().primaryKey(),
    trend_id: uuid('trend_id').references(() => trendsTable.id).notNull(),
    hashtag_id: uuid('hashtag_id').references(() => hashtagsTable.id).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull()
})