import OpenAI from "openai";

export class EmbeddingService {
    private openai: OpenAI;

    constructor() {
        if (!process.env.NVIDIA_API_KEY) {
            console.warn("NVIDIA_API_KEY is missing. EmbeddingService will fail if used.");
        }
        this.openai = new OpenAI({
            apiKey: process.env.NVIDIA_API_KEY || '',
            baseURL: 'https://integrate.api.nvidia.com/v1',
        });
    }

    public async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await this.openai.embeddings.create({
                model: "baai/bge-m3",
                input: [text],
                encoding_format: "float",
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error("  - Error calling NVIDIA Embedding API:", error);
            // Fallback to a zero-vector so the pipeline doesn't crash completely during testing
            return new Array(1024).fill(0);
        }
    }
}