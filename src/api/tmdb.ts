import axios from "axios";

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null; 
    genre_ids: number[];
    release_date: string;
    popularity: number;
    original_language: string; 
}

export interface MovieDetail {
    id: number; 
    title: string;
    overview: string;
    poster_path: string | null; 
    genres: Genre[];
    release_date: string;
    original_language: string; 
    runtime: number | null; 
    status: string;
}

export interface Genre {
    id: number;
    name: string; 
}

/* References:
- https://www.npmjs.com/package/axios#features
- https://github.com/lukehoban/es6features 
*/ 

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3', 
    timeout: 10000, 
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'en-US',
    },
});

export async function fetchPopularMovies(): Promise<Movie[]> {
    try {
        const pages = [];
        for (let pageNum = 1; pageNum <= 15; pageNum++) {
            const request = instance.get<{results: Movie[]}>('/movie/popular', {
                params: {page: pageNum}, 
            });
            pages.push(request);
        }
        
        const pageResponses = await Promise.all(pages);
        const allMovies = pageResponses.flatMap((response) =>
            response.data.results
        );

        const uniqueMovies: Movie[] = [];
        const seenId = new Set<number>();
        for (const i of allMovies) {
            if (!seenId.has(i.id)) {
                seenId.add(i.id);
                uniqueMovies.push(i);
            }
        }
        
        return uniqueMovies;
    } catch (error) {
        console.error('Failed to fetch popular movies:', error);
        throw error;
    }
}

export async function fetchGenres(): Promise<Genre[]> {
    try {
        const response = await instance.get<{genres: Genre[]}>('/genre/movie/list');
        const genres = response.data.genres;
        return genres;
    } catch (error) {
        console.error('Failed to fetch genres:', error);
        throw error;
    }
}

export async function fetchMovieDetail(id: string): Promise<MovieDetail> {
    try {
        const response = await instance.get<MovieDetail>(`/movie/${id}`);
        const movieDetails = response.data;
        return movieDetails;
    } catch (error) {
        console.error('Failed to fetch movie details:', error);
        throw error;
    }
}

export function posterUrl(path: string | null): string | null {
    if (path === null) {
        return null;
    }
    return `https://image.tmdb.org/t/p/w500${path}`;
}
