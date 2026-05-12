import { pgTable, integer, varchar, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './index.ts'

export type FilterType = {
    platform?: string[];
    categories?: string[];
    country?: string;
    sortBy?: string;
    minViews?: number;
    language?: string;
    verifiedOnly?: boolean;
    sentiment?: string
}

export const searchHistoryTable = pgTable('search_history', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => usersTable.id, {
        onDelete: 'cascade'
    }).notNull(),
    query: varchar('query', { length: 500 }).notNull(),
    filters: jsonb('filters').$type<FilterType>(),
    results_count: integer('results_count').default(0),
    searched_at: timestamp('searched_at', { mode: 'date', withTimezone: true}).defaultNow().notNull(),
})