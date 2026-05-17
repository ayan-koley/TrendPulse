export function cleanHashtags(tags: string[]): string[] {
    return tags.slice(0, 10).map(t => '#' + t.replace(/\s+/g, "")).filter(t => t.length < 32);
}