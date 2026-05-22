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

    const normalizedEngagement =
        Math.min(40, Math.log10(engagementCount + 1) * 5);

    const normalizedPosts =
        Math.min(30, Math.log10(postCount + 1) * 8);

    const normalizedVelocity =
        Math.min(30, velocityScore * 0.3);

    const score =
        normalizedEngagement +
        normalizedPosts +
        normalizedVelocity;

    return +score.toFixed(2);
}