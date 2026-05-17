export function calculateEngagement(views: number, likes: number, comments: number): number {
    return ((views * 1) + (likes * 10) + (comments * 5));
}
export function calculateEngagementRate(totalViews: number, engagement: number): number {
    return totalViews === 0 ? 0 : (engagement / totalViews) * 100
}  