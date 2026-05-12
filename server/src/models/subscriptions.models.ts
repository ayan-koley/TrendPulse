import { pgTable, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core'
import { usersTable, userSubscriptionEnum } from './index.ts'

export const userSubscriptionStatus = ["active", "cancelled", "expired"] as const;

export type UserSubscriptionStatus = (typeof userSubscriptionStatus)[number];

export const userSubscriptionStatusEnum = pgEnum('subscription_status', userSubscriptionStatus);


export const subscriptionsTable = pgTable('subscriptions', {
     id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => usersTable.id, {
        onDelete: 'cascade'
    }).notNull(),
    plan: userSubscriptionEnum('plan').notNull(),
    status: userSubscriptionStatusEnum('status').notNull(),
    started_at: timestamp('started_at', { mode: 'date', withTimezone: true}).defaultNow().notNull(),
    expires_at: timestamp('expires_at', { mode: 'date', withTimezone: true}).notNull(),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true}).defaultNow().notNull(),
})