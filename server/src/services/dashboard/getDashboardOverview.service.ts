import type { TrendingTopics } from "../normalizers/youtube.normalizer.ts";
import { getDashboardOverviewStats, getSparklineData, getTopTrendsForDashboard } from "../repositories/dashboard.repositories.ts";

export const getDashboardOverviewService =
  async () => {

    try {
        // TODO:
        // Fetch top active trends
        // Example:
        // top 20 trends ordered by trend_score / rank_position
        const topTrends = await getTopTrendsForDashboard();
        if(!topTrends) {
            throw new Error("Unable to fetch top trends for dashboard overview");
        }

        const trendWithSparkline = await Promise.all(
            topTrends.map(async(trend) => {
                const sparkline = await getSparklineData(trend.id);
                return {
                    ...trend,
                    sparkline
                }
            })
        )


        // TODO:
        // Fetch dashboard overview statistics
        // Example:
        // total trends
        // active trends
        // top platform
        // fastest growing trend
        const dashboardStats = await getDashboardOverviewStats();


        // TODO:
        // Fetch top hashtags
        // Example:
        // hashtags ordered by usage_count


        // TODO:
        // Format frontend-ready response


        // TODO:
        // Return final dashboard object
        return {
            overview: {
              ...dashboardStats
            },
            topTrends: trendWithSparkline
        };
    } catch (error: any) {
        console.error("Error in getDashboardOverviewService:", error);
    }

};