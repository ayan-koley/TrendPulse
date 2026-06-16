// src/controllers/trend.controller.ts
import type { Request, Response } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../config/db.ts';
import { trendsTable } from '../models/trends.models.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';

/**
 * 🔥 Controller 1: Fetch all trending topics sorted by highest trend score
 */
export const getTrendingDashboardData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch trends ordered from Exploding (highest score) to Steady
    const rawTrends = await db
      .select()
      .from(trendsTable)
      .orderBy(desc(trendsTable.overall_trend_score)).limit(20);

    // Transform database snake_case keys into frontend-ready camelCase payloads
    const formattedDashboardTrends = rawTrends.map((trend) => ({
      trendId: trend.id,
      topic: trend.topic,
      category: trend.category,
      overallTrendScore: trend.overall_trend_score,
      status: trend.status,
      metrics: trend.metrics,
      historicalGraphData: trend.historical_graph_data,
      aiSuggestions: trend.ai_suggestions,
    }));

    res.status(200).json({
      success: true,
      count: formattedDashboardTrends.length,
      data: formattedDashboardTrends,
    });
  } catch (error: any) {
    console.error("❌ Controller Error in getTrendingDashboardData:", error.message);
    res.status(500).json({
      success: false,
      message: "Server failed to compile trending assets feeds.",
    });
  }
});

/**
 * 🔍 Controller 2: Fetch specific trend node details by ID
 */
export const getTrendDetailsById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ success: false, message: "Trend UUID parameter required." });
      return;
    }

    const [trend] = await db
      .select()
      .from(trendsTable)
      .where(eq(trendsTable.id, id as string))
      .limit(1);

    if (!trend) {
      res.status(404).json({ success: false, message: "Requested trending topic node not found." });
      return;
    }

    // Single item mapper transformation
    const formattedTrend = {
      trendId: trend.id,
      topic: trend.topic,
      category: trend.category,
      overallTrendScore: trend.overall_trend_score,
      status: trend.status,
      metrics: trend.metrics,
      historicalGraphData: trend.historical_graph_data,
      aiSuggestions: trend.ai_suggestions,
    };

    res.status(200).json({
      success: true,
      data: formattedTrend,
    });
  } catch (error: any) {
    console.error(`❌ Controller Error in getTrendDetailsById context:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching isolated trend profile matrix.",
    });
  }
});