export function calcRankChange(previousRank: number, currentRank: number): number {
  if (!previousRank) return 0;
  return previousRank - currentRank;
}