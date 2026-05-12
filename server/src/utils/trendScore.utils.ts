export function calculateTrendScore(engagement: number): number {
    return Math.min(100, (engagement / 1_000_000) & 100);
}