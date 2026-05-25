export interface TrendSnapshot {
    postCount: number,
    totalEngagement: number
}

export const calculateVelocityScore = (current: TrendSnapshot, previous: TrendSnapshot |
     null, hoursPassed: number = 4
) => {
    if(!previous || previous.postCount === 0 || previous.totalEngagement === 0) {
        return {
            velocityScore: current.totalEngagement > 50000 ? 40 : 20,
            hourlyGrowth: 0.0
        };
    }

    // 1. calculate growth rate per hours
    const newPost = Math.max(0, current.postCount - previous.postCount);
    const newEngagement = Math.max(current.totalEngagement - previous.totalEngagement);

    const postGrowthPerHours = newPost / hoursPassed;
    const engagementGrowthPerHours = newEngagement / hoursPassed;

    const postGrowthRate = postGrowthPerHours / previous.postCount;
    const engagementGrowthRate = engagementGrowthPerHours / previous.totalEngagement;

    const rawVelocityIndex = (postGrowthRate * 0.30) + (engagementGrowthRate * 0.70);

    const multiplier = 50; 
    let finalScore = Math.round(Math.log1p(rawVelocityIndex) * multiplier);

    if(finalScore > 100) finalScore = 100;
    if(finalScore < 0) finalScore = 0;

    return {
        velocityScore: finalScore,
        hourlyGrowth: parseFloat((engagementGrowthRate * 100).toFixed(2))
    };
}