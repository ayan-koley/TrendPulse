import jwt, { type Algorithm } from 'jsonwebtoken';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { 
        algorithm: ( process.env.JWT_ALGORITHM || "HS256" )as Algorithm,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as any ,
    })
}

export const generateRefreshToken = (payload: TokenPayload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { 
        algorithm: ( process.env.JWT_ALGORITHM || "HS256" )as Algorithm,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any ,
    })
}