import type { NormalizedVideo } from "../normalizers/youtube.normalizer.ts";

export const groupVideosByHashtags = (videos: NormalizedVideo[]): Map<string, NormalizedVideo[]> => {
    const hashMap: Map<string, NormalizedVideo[]> = new Map();

    for(const video of videos) {
        for(const tag of video.hashtags) {
            if(!hashMap.has(tag)) {
                hashMap.set(tag, []);
            }
            hashMap.get(tag)?.push(video);
        }
    } 
    return hashMap;
}