export interface NormalizedContent {
  id: string;
  platform:
    | "youtube"
    | "twitter"
    | "instagram"
    | "reddit"
    | "stackoverflow";
  title: string;
  description?: string;
  hashtags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  publishedAt: Date;
  author?: string;
  language: string;
}
