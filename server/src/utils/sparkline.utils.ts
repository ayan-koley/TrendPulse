export type Snapshots = {
    engagement_count: number
}

export function buildSparkline(snapshots: Snapshots[] = [] ) {
  if (snapshots.length === 0) return [];

  return snapshots
    .slice(-10)
    .map(s => s.engagement_count || 0);
}
