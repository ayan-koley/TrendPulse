import axios, { type AxiosResponse } from 'axios';


type Thumbnail = {
    url: string,
    width: number,
    height: number
}

type Thumbnails = {
    default: Thumbnail,
    medium: Thumbnail,
    high: Thumbnail,
    standard: Thumbnail,
    maxres: Thumbnail
}

type Statistics = {
    likeCount: string,
    favoriteCount: string,
    commentCount: string
    viewCount: string,
}

export type Item = {
    kind: string,
    etag: string,
    id: string,
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: Thumbnails,
        channelTitle: string,
        tags: string[],
        categoryId: string,
        liveBroadcastContent: string,
        defaultLanguage: string,
        localized: {
            title: string,
            description: string
        },
        defaultAudioLanguage: string
    }
    statistics: Statistics
}

export type YoutubeResponse = {
    kind: string,
    etag: string,
    items: Item[],
    nextPageToken: string,
    pageInfo: {
        totalResults: number,
        resultsPerPage: number
    }
}

// export async function generateTrendingVideos(): Promise<YoutubeResponse> {
export async function generateYoutubeTrendingVideos(): Promise<YoutubeResponse> {
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