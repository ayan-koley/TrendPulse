type TrendScoreInput = {
  engagementCount: number;
  velocityScore: number;
  postCount: number;
};

export function calculateTrendScore({
    engagementCount,
    velocityScore,
    postCount
}: TrendScoreInput): number {

    const normalizedEngagement = Math.log10(engagementCount + 1) * 20;

    const normalizedPosts =  Math.log10(postCount + 1) * 15;

    const score =
        normalizedEngagement +
        velocityScore * 0.5 +
        normalizedPosts;

    return Number(
        Math.min(100, score).toFixed(2)
    );
}