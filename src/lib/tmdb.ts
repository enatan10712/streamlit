import axios from 'axios';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  status: string;
  budget: number;
  revenue: number;
  cast?: Cast[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  vote_average: number;
}

// API Calls
export const tmdbAPI = {
  getTrendingMovies: (page = 1) =>
    tmdbClient.get('/trending/movie/week', { params: { page } }),

  getTrendingShows: (page = 1) =>
    tmdbClient.get('/trending/tv/week', { params: { page } }),

  getPopularMovies: (page = 1) =>
    tmdbClient.get('/movie/popular', { params: { page } }),

  getPopularShows: (page = 1) =>
    tmdbClient.get('/tv/popular', { params: { page } }),

  getTopRatedMovies: (page = 1) =>
    tmdbClient.get('/movie/top_rated', { params: { page } }),

  getTopRatedShows: (page = 1) =>
    tmdbClient.get('/tv/top_rated', { params: { page } }),

  getUpcomingMovies: (page = 1) =>
    tmdbClient.get('/movie/upcoming', { params: { page } }),

  getMovieDetail: (movieId: number) =>
    tmdbClient.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits' },
    }),

  getTVDetail: (showId: number) =>
    tmdbClient.get(`/tv/${showId}`, {
      params: { append_to_response: 'credits' },
    }),

  searchMulti: (query: string, page = 1) =>
    tmdbClient.get('/search/multi', { params: { query, page } }),

  searchMovies: (query: string, page = 1) =>
    tmdbClient.get('/search/movie', { params: { query, page } }),

  getMovieGenres: () =>
    tmdbClient.get('/genre/movie/list'),

  getTVGenres: () =>
    tmdbClient.get('/genre/tv/list'),

  getMoviesByGenre: (genreId: number, page = 1) =>
    tmdbClient.get('/discover/movie', {
      params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
    }),

  getTVShowsByGenre: (genreId: number, page = 1) =>
    tmdbClient.get('/discover/tv', {
      params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
    }),
};

// Image URL helper
export const getImageUrl = (path: string | null, size = 'original') => {
  if (!path) return '/placeholder.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
