export const STOP_WORDS = new Set([
  'with', 'this', 'that', 'from', 'your', 'video', 'youtube', '2026',
  'what', 'here', 'when', 'some', 'about', 'how', 'vlog', 'chanel']);


export const extractVirtualHashtags = (title: string, description: string): string[] => {
    // combine title and description and converted into lowercase
    const combinedText = `${title} ${description.slice(0, 100)}`.toLowerCase();
    // replace and split keywords and filter which are less then 3 and not include in STOP_WORDS set
    const words = combinedText.replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(word => word.length > 3 && !STOP_WORDS.has(word));

    const virtualTags: string[] = [];
    // combine the split array i and i+1 element
    for(let i=0; i < words.length-1; i++) {
        virtualTags.push(`${words[i]}${words[i+1]}`);
    }
    // return result array
    return Array.from(new Set(virtualTags));
}