import natural from 'natural';
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;


export const cleanTopicText  = (rawText: string): string => {
    if(!rawText) return "";

    return rawText
        .toLowerCase()
        .replace(/[^\w\s\.]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[-_]/g, ' ')
        .trim()
}

export const generateStemmedFingerprint = (cleanedText: string): string => {
    const tokens = tokenizer.tokenize(cleanedText);
    if(!tokens || tokens.length === 0) return '';

    const stemmedTokens = tokens.map(token => stemmer.stem(token));

    return stemmedTokens.sort().join(' ');
}

export const findExistingDuplicate = (
    incomingTopics: string,
    existingActiveTopics: { id: string, topic: string}[]
): string | null => {
    const cleanedIncoming = cleanTopicText(incomingTopics);
    const fingerprintIncoming = generateStemmedFingerprint(cleanedIncoming);

    const DUPLICATE_THRESHOLD = 0.85;

    let matchedTrendId: string | null = null;
    let highestScore = 0;

    for(const record of existingActiveTopics) {
        const cleanedExisting = cleanTopicText(record.topic);
        const fingerprintExisting = generateStemmedFingerprint(cleanedExisting);

        if(fingerprintIncoming === fingerprintExisting) {
            return record.id
        }

        // fuzzy string distance
        const similarityScore = natural.JaroWinklerDistance(cleanedIncoming, cleanedExisting, {
            ignoreCase: true
        })

        if(similarityScore > highestScore) {
            highestScore = similarityScore;
            if(highestScore >= DUPLICATE_THRESHOLD) {
                matchedTrendId = record.id;
            }
        }
    }

    return matchedTrendId;
}