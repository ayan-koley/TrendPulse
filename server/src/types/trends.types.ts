export interface YouTubeMetrics {
    trafficScore: number;
    preferredFormat: 'Long-Form' | 'Short-Form';
    viewVelocityPerHour: number;
}
export interface InstagramMetrics {
  trafficScore: number;
  trendingAudios: string[];
  recommendedHashtags: string[];
}
export interface TwitterMetrics {
  trafficScore: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topPhrases: string[];
}
export interface RedditMetrics {
  trafficScore: number;
  activeSubreddits: string[];
  userPainPoints: string[];
}
export interface PlatformDataBucket {
  youtube?: YouTubeMetrics;
  instagram?: InstagramMetrics;
  twitter?: TwitterMetrics;
  reddit?: RedditMetrics;
}

export interface HistoricalGraphNode {
    timestamp: string; 
    score: number;
    youtube_volume: number;
    instagram_volume: number;
    twitter_volume: number;
    reddit_volume: number;
}

export interface AISuggestionsPayload {
    titleHooks: string[];
    scriptHook: string;
}

export interface ScrapedTrendPayload {
  topic: string;
  category: string;
  summary: string;
  metrics: PlatformDataBucket;
  aiSuggestions: AISuggestionsPayload;
}