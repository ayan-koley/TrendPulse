import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getDashboardOverviewService } from "../services/dashboard/getDashboardOverview.service.ts";


const getDashboardOverview = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const response = await getDashboardOverviewService();

    return res.status(200).json(
        response
    );
})

export {
    getDashboardOverview    
}