import * as z from 'zod';

export const userBasedSchema = z.object({
    id: z.uuid(),
    username: z.string().min(3).max(50),
    email: z.email().max(255),
    role: z.enum(["user"]).default("user"),
    subscriptionPlan: z.enum(["free", "pro"]).default("free"),
    interests: z.array(z.string()).optional().default([]),
    avatarUrl: z.url().max(500).nullable().optional(),
    isVerified: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const createUserSchema = userBasedSchema.pick({
    username: true,
    email: true,
    role: true,
    subscriptionPlan: true,
    isVerified: true,
}).extend({
    password: z.string().min(8).max(100),
})

export const updateUserSchema = userBasedSchema.pick({
    avatarUrl: true,
    interests: true,
    isVerified: true,
    subscriptionPlan: true,
}).partial()

export const loginUserSchema = z.object({
    email: z.email().max(255),
    password: z.string().min(8).max(100),
})

export type createUserInput = z.infer<typeof createUserSchema>;
export type updateUserInput = z.infer<typeof updateUserSchema>;
export type loginUserInput = z.infer<typeof loginUserSchema>;