import type { NormalizedVideo } from "../normalizers/youtube.normalizer.ts";

export const HASHTAG_BLACKLIST = new Set([
    'viral', 'trending', 'foryou', 'fyp', 'shorts', 
    'video', 'youtube', 'instagram', 'explore', 'reels'
]);

export const groupVideosByHashtags = (videos: NormalizedVideo[]): Map<string, NormalizedVideo[]> => {
    const hashMap: Map<string, NormalizedVideo[]> = new Map();

    for(const video of videos) {
        for(const tag of video.hashtags) {
            // Normalized hashtag
            const cleanedTag = tag.toLowerCase().replace(/[^a-z0-9]/g, "");
            if(!cleanedTag || HASHTAG_BLACKLIST.has(cleanedTag)) continue;
            if(!hashMap.has(cleanedTag)) {
                hashMap.set(cleanedTag, []);
            }
            hashMap.get(cleanedTag)?.push(video);
        }
    } 
    return hashMap;
}