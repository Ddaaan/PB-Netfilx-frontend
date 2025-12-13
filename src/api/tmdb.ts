import axios from "axios";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";

export type TmdbMovie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    vote_average?: number;
};

export type TmdbListResponse = {
    page: number;
    results: TmdbMovie[];
    total_pages: number;
};

function getApiKey() {
    return localStorage.getItem("TMDb-Key") || "";
}

export function posterUrl(path: string | null, size: "w342" | "w500" | "original" = "w342") {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

async function get<T>(path: string, params: Record<string, any> = {}) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("TMDB API Key가 없습니다. /signin에서 로그인 후 이용하세요.");

    const res = await axios.get<T>(`${BASE_URL}${path}`, {
        params: { api_key: apiKey, language: "ko-KR", ...params },
    });
    return res.data;
}

export const tmdb = {
    nowPlaying: (page = 1) => get<TmdbListResponse>("/movie/now_playing", { page }),
    popular: (page = 1) => get<TmdbListResponse>("/movie/popular", { page }),
    topRated: (page = 1) => get<TmdbListResponse>("/movie/top_rated", { page }),
    upcoming: (page = 1) => get<TmdbListResponse>("/movie/upcoming", { page }),

    // (다음 단계에서 사용) 검색
    search: (query: string, page = 1) => get<TmdbListResponse>("/search/movie", { query, page, include_adult: false }),
};

export type Genre = {
    id: number;
    name: string;
};

export const tmdbExtra = {
    genres: async (): Promise<Genre[]> => {
        const res = await get<{ genres: Genre[] }>("/genre/movie/list");
        return res.genres;
    },
};
