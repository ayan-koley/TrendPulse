import { pgTable, timestamp, uuid, text } from 'drizzle-orm/pg-core'
import { usersTable, trendsTable } from './index.ts'

export const savedTrendsTable = pgTable('saved_trends', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull().references(() => usersTable.id),
    trend_id: uuid('trend_id').notNull().references(() => trendsTable.id),
    notes: text('notes'),
    saved_at: timestamp('saved_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
