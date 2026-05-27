import { pgEnum, pgTable, varchar, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core'

const userRoles = ["user", "admin"] as const;
const userSubscrtionsPlans = ["free", "pro"] as const;

export type UserRole = (typeof userRoles)[number];
export type SubscriptionsPlan = (typeof userSubscrtionsPlans)[number];
// Drizzle enum
export const userRoleEnum = pgEnum('user_role', userRoles);
export const userSubscriptionEnum = pgEnum('user_subscription', userSubscrtionsPlans);

export const usersTable = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    subscription_plan: userSubscriptionEnum("subscription_plan").default("free").notNull(),
    interests: text('interests').array().default([]),
    avatar_url: varchar('avatar_url', { length: 500 }).default(''),
    is_verified: boolean().default(false),
    refresh_token: text('refresh_token').default(""),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true}).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: true}).defaultNow().notNull(),
})