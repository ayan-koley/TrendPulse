export function calcGrowthRate(previousEngagement: number, currentEngagement: number): number {
    if(!previousEngagement || previousEngagement === 0) return 0.00;
    const growth = ((currentEngagement - previousEngagement) / previousEngagement) * 100;
    
    return parseFloat(growth.toFixed(2));
}