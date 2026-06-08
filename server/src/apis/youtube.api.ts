import type { YoutubeResponse } from '../services/collectors/youtube.service.ts'
import axios from 'axios';

export async function fetchTrendingYoutubeVideos(): Promise<YoutubeResponse> {
    try {
        const response: YoutubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,statistics',
                chart: 'mostPopular',
                maxResults: 50,
                regionCode: 'IN',
                key: process.env.YOUTUBE_API_KEY
            }
        }).then(d => d.data)

        return response;
    } catch (e: any) {
        if(axios.isAxiosError(e)) {
            console.error("Error on youtube fetch data ", e.message);
        }
        throw e;
    }
}