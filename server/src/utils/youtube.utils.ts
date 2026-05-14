import { countries } from "../models/trends.models.ts";

export const YOUTUBE_CATEGORIES = {
    "1": "Film",
    "10": "Music",
    "17": "Sports",
    "20": "Gaming",
    "22": "Lifestyle",
    "24": "Entertainment",
    "25": "News",
    "26": "How-to",
    "27": "Education",
    "28": "Technology",
} as const;

export const YOUTUBE_COUNTRY = {
    "en": 0,
    "en-US": 0,
    "te": 1,
    "hi": 1,
    "en-IN": 1,
    "de": 5, 
    "fr": 6,
    "ja": 7,
    "es": 8, 
    "pt": 9,
    "ko": 10,
    "ar": 11,
} as const;

export function getYoutubeCategory(id: string) {
    return YOUTUBE_CATEGORIES[id as keyof typeof YOUTUBE_CATEGORIES] ?? "Unknown";
}

export function getYoutubeCountry(lang: string) {
    return countries[YOUTUBE_COUNTRY[lang as keyof typeof YOUTUBE_COUNTRY] || 0];
}