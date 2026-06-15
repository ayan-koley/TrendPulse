import type { Request, Response, NextFunction} from 'express'
import { asyncHandler } from "../utils/asyncHandler.ts";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { db } from '../config/db.ts';
import { usersTable } from '../models/users.models.ts';
import { eq } from 'drizzle-orm';
import { ApiResponse } from '../utils/ApiResponse.ts';

export const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
            const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
            if (!accessToken) {
                return res.status(401).json({ message: "Access token not found" });
            }
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
            const [user] = await db.select({id: usersTable.id, email: usersTable.email, username: usersTable.username, role: usersTable.role}).from(usersTable).where(eq(usersTable.id, decoded.userId)).limit(1);

            if (!user) {
                throw ApiResponse.error("Unauthorized User", null);
            }
            // TODO: Fixed later 
            (req as any).user = user;
            next();
    } catch (error: any) {
        console.error("Error verifying token:", error);
        next(error);
    }
})