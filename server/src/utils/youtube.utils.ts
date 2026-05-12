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
    "te": "IN",
    "hi": "IN",
    "en": "US",
    "ja": "JP",
    "ko": "KR",
    "pt": "BR",
    "es": "ES", 
    "fr": "FR",
    "de": "DE", 
    "ar": "SA",
    "en-IN": "IN",
    "en-US": "US"
} as const;

export function getYoutubeCategory(id: string) {
    return YOUTUBE_CATEGORIES[id as keyof typeof YOUTUBE_CATEGORIES] ?? "Unknown";
}

export function getYoutubeCountry(lang: string) {
    return YOUTUBE_COUNTRY[lang as keyof typeof YOUTUBE_COUNTRY] || "US";
}