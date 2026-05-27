import { createUserSchema, loginUserSchema } from "../schemas/user.schemas.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db.ts";
import { usersTable } from "../models/users.models.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import * as z from 'zod';
import { eq } from "drizzle-orm";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.ts";

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const validation = createUserSchema.safeParse(req.body);

    if(!validation.success) {
        return res.status(400).json(
            ApiResponse.error("Validation failed", z.treeifyError(validation.error))
        );
    }

    const { username, email, password, role, subscriptionPlan, isVerified } = validation.data;
    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
        username,
        email,
        password_hash: passwordHash,
        role,
        subscription_plan: subscriptionPlan,
        is_verified: isVerified,
        created_at: new Date(),
        updated_at: new Date(),
    });

    return res.status(201).json(
        ApiResponse.success(null, "User created successfully")
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const validation = loginUserSchema.safeParse(req.body);
    if(!validation.success) {
        return res.status(400).json(
            ApiResponse.error("Validation failed", z.treeifyError(validation.error))
        );
    }
    const {email, password} = validation.data;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if(!user) {
        return res.status(404).json(
            ApiResponse.error("User not found", null)
        );
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if(!passwordMatch) {
        return res.status(401).json(
            ApiResponse.error("Invalid credentials", null)
        );
    }

    const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    await db.update(usersTable).set({refresh_token: refreshToken}).where(eq(usersTable.id, user.id));

    return res.status(200)
    .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
    })
    .json(
        ApiResponse.success({ accessToken, refreshToken }, "User logged in successfully")
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) {
        return res.status(401).json(ApiResponse.error("Unauthorized", null));
    }
    await db.update(usersTable).set({ refresh_token: null }).where(eq(usersTable.id, user.id));

    return res.status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(ApiResponse.success(null, "User logged out successfully"));
})

const refreshRefreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json(ApiResponse.error("Refresh token not found", null));
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.refresh_token, refreshToken)).limit(1);

    if(!user) {
        return res.status(401).json(ApiResponse.error("Invalid refresh token", null));
    }

    const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return res.status(200)
    .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
    })
    .json(
        ApiResponse.success({ accessToken: newAccessToken }, "Access token refreshed successfully")
    );
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;

    return res.status(200)
    .json(
        ApiResponse.success(user, "Current user retrieved successfully")
    );
});

export {
    createUser,
    loginUser,
    logoutUser,
    refreshRefreshToken,
    getCurrentUser
}   
