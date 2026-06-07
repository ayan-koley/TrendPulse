import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                role: string;
                subscription_plan: string;
            }
        }
    }
}