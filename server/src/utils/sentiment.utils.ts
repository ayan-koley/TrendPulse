export function calculateSentimentScore(title: string) {
    const positive = ["special","best","love","beautiful","amazing","top","festival","celebration"];
    const negative = ["fail","bad","problem","worst","hate","sad","death","crisis"];

    const lower = title.toLowerCase();

    if(positive.some(w => lower.includes(w))) return 0.75;
    if(negative.some(w => lower.includes(w))) return 0.25;

    return 0.50;
}