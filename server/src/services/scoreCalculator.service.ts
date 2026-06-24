// src/services/scoreCalculator.ts

interface PlatformTrafficScores {
  youtubeScore: number;
  twitterScore: number;
  redditScore: number;
  instagramScore: number;
  viewVelocity: number; // Hourly speed
}

export function calculateOverallTrendScore(metrics: PlatformTrafficScores): { score: number; status: string } {
  // 1. Define weights optimized for "Tech & Coding" category
  const weights = {
    twitter: 0.35,
    reddit: 0.35,
    youtube: 0.20,
    instagram: 0.10
  };

  // 2. Compute Weighted Base Score
  const baseScore = 
    (metrics.twitterScore * weights.twitter) +
    (metrics.redditScore * weights.reddit) +
    (metrics.youtubeScore * weights.youtube) +
    (metrics.instagramScore * weights.instagram);

  // 3. Determine Velocity Multiplier based on hourly spikes
  let multiplier = 1.0;
  if (metrics.viewVelocity > 3000) {
    multiplier = 1.25; // Exploding spike boost
  } else if (metrics.viewVelocity > 1000) {
    multiplier = 1.10; // Steady rise boost
  }

  // 4. Calculate Final Score & Clamp it at maximum 100
  const finalScore = Math.min(100, Math.round(baseScore * multiplier));

  // 5. Derive Status Label based on final output string
  let status = 'Steady';
  if (finalScore >= 85) status = 'Exploding';
  else if (finalScore >= 60) status = 'Rising';
  else if (finalScore < 30) status = 'Dying';

  return {
    score: finalScore,
    status: status
  };
}