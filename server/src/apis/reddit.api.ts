// src/services/collectors/reddit.service.ts
import axios from 'axios';

export interface RedditRawPost {
  kind: string;
  data: {
    id: string;
    title: string;
    subreddit: string;
    ups: number;
    num_comments: number;
    permalink: string;
    selftext?: string;
  };
}

export interface RedditAPIResponse {
  data: {
    children: RedditRawPost[];
  };
}

export async function fetchTrendingRedditPosts(): Promise<RedditAPIResponse> {
  try {
    // Target the absolute tech hotbeds for coding trends
    const targetSubreddits = 'webdev+reactjs+programming+nextjs';
    const url = `https://www.reddit.com/r/${targetSubreddits}/hot.json?limit=25`;

    const response = await axios.get<RedditAPIResponse>(url, {
      headers: {
        'User-Agent': 'web:trendpulse-backend:v1.0.0 (by /u/ayank0003)',
        'Accept': 'application/json',
      }
    });
    console.log("Reddit response ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching data from Reddit API:", error.message);
    throw error;
  }
}