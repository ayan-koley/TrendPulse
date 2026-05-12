export function calculateVelocityScore(publishedAt: string): number {
    const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;

    if(ageHours < 1) return 95.00;
    if(ageHours < 6) return 80.00;
    if(ageHours < 12) return 65.00;
    if(ageHours < 24) return 50.00;
    if(ageHours < 48) return 35.00;

    return 20.00;
}