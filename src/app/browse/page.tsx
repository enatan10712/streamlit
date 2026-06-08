"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import MovieCard from "@/components/MovieCard";
import ContentDetailModal from "@/components/ContentDetailModal";
import BrowseSkeleton from "@/components/skeletons/BrowseSkeleton";
import { getImageUrl, Movie, TVShow, tmdbAPI } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useWatchListStore } from "@/store/useWatchListStore";

type RowItem = Movie | TVShow;

const titleFor = (item: RowItem) => "title" in item ? item.title : item.name;

export default function BrowsePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const { addFavorite, removeFavorite, isFavorite } = useWatchListStore();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<RowItem[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [filteredContent, setFilteredContent] = useState<RowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{ id: number; type: 'movie' | 'tv' } | null>(null);

  const featured = useMemo(() => trendingMovies[0] || popularMovies[0], [trendingMovies, popularMovies]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!currentProfile) {
      router.replace("/profiles");
    }
  }, [authLoading, user, currentProfile, router]);

  useEffect(() => {
    if (!user || !currentProfile) return;

    const loadContent = async () => {
      try {
        setLoading(true);

        // Map continue watching from profile
        if (currentProfile.continueWatching) {
          const mappedContinueWatching: RowItem[] = currentProfile.continueWatching.map(item => ({
            id: parseInt(item.contentId),
            title: item.title,
            name: item.title,
            overview: "",
            poster_path: item.posterPath,
            backdrop_path: item.posterPath,
            release_date: "",
            first_air_date: "",
            vote_average: 0,
            genre_ids: [],
            popularity: 0
          } as unknown as RowItem));
          setContinueWatching(mappedContinueWatching);
        }

        const [movies, shows, popular, topRated, upcoming, genreRes] = await Promise.all([
          tmdbAPI.getTrendingMovies(),
          tmdbAPI.getTrendingShows(),
          tmdbAPI.getPopularMovies(),
          tmdbAPI.getTopRatedMovies(),
          tmdbAPI.getUpcomingMovies(),
          tmdbAPI.getMovieGenres(),
        ]);
        setTrendingMovies(movies.data.results || []);
        setTrendingShows(shows.data.results || []);
        setPopularMovies(popular.data.results || []);
        setTopRatedMovies(topRated.data.results || []);
        setUpcomingMovies(upcoming.data.results || []);
        setGenres(genreRes.data.genres || []);
      } catch (error) {
        console.error(error);
        toast.error("Could not load TMDB content. Check your API key.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [user, currentProfile]);

  const handlePlay = (id: string | number) => router.push(`/watch/${id}`);

  const handleFavoriteToggle = (id: string | number) => {
    const allItems: RowItem[] = [
      ...trendingMovies,
      ...trendingShows,
      ...popularMovies,
      ...topRatedMovies,
      ...upcomingMovies,
    ];
    const item = allItems.find((entry) => entry.id.toString() === id.toString());
    if (!item) return;

    if (isFavorite(id.toString())) {
      removeFavorite(id.toString());
      toast.success("Removed from My List");
    } else {
      addFavorite({
        id: id.toString(),
        type: "title" in item ? "movie" : "tv",
        title: titleFor(item),
        posterPath: item.poster_path || "",
        rating: item.vote_average || 0,
        addedAt: 0, // Placeholder, updated in store if needed or just use 0
      });
      toast.success("Added to My List");
    }
  };

  const checkFavorite = (id: string | number) => isFavorite(id.toString());

  const handleOpenModal = (id: number, type: 'movie' | 'tv') => {
    setSelectedContent({ id, type });
  };

  const handleCloseModal = () => {
    setSelectedContent(null);
  };

  useEffect(() => {
    let isMounted = true;

    if (!selectedGenre) {
      return;
    }

    const fetchFiltered = async () => {
      setFiltering(true);
      try {
        const { data } = await tmdbAPI.getMoviesByGenre(selectedGenre);
        if (isMounted) setFilteredContent(data.results || []);
      } catch (error) {
        if (isMounted) {
          console.error(error);
          toast.error("Failed to filter content");
        }
      } finally {
        if (isMounted) setFiltering(false);
      }
    };

    fetchFiltered();
    return () => { isMounted = false; };
  }, [selectedGenre]);

  if (authLoading || loading || !user || !currentProfile) {
    return <BrowseSkeleton />;
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />

      {/* Genre Filter Bar */}
      <div className="sticky top-16 z-30 flex items-center gap-4 bg-background/80 px-5 py-4 backdrop-blur-md md:px-12">
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">Genres</span>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedGenre(null)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition",
              selectedGenre === null ? "bg-primary text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white"
            )}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition",
                selectedGenre === genre.id ? "bg-primary text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white"
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {selectedGenre ? (
        <div className="px-5 pt-24 pb-20 md:px-12">
          <h2 className="mb-8 text-3xl font-bold">
            {genres.find(g => g.id === selectedGenre)?.name} Movies
          </h2>
          {filtering ? (
             <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
             </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredContent.map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={titleFor(item)}
                  posterPath={item.poster_path}
                  rating={item.vote_average || 0}
                  onPlay={() => handlePlay(item.id)}
                  isFavorite={checkFavorite(item.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : featured && (
        <section className="relative flex min-h-[82vh] items-end overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getImageUrl(featured.backdrop_path, "original")})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-3xl px-5 pb-28 pt-32 md:px-12"
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-primary">Featured today</p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-7xl">{featured.title}</h1>
            <p className="mt-5 line-clamp-3 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">
              {featured.overview}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handlePlay(featured.id)}
                className="flex items-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200"
              >
                <Play className="h-5 w-5 fill-current" />
                Play
              </button>
              <button
                type="button"
                onClick={() => handleOpenModal(featured.id, 'title' in featured ? 'movie' : 'tv')}
                className="flex items-center gap-2 rounded-md bg-white/15 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/25"
              >
                <Info className="h-5 w-5" />
                Details
              </button>
            </div>
          </motion.div>
        </section>
      )}

      <div className="relative z-10 -mt-20 space-y-10 px-5 pb-20 md:px-12">
        {continueWatching.length > 0 && (
          <ContentRow
            title="Continue Watching"
            items={continueWatching}
            onMovieClick={(id) => handleOpenModal(Number(id), 'movie')}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={checkFavorite}
          />
        )}
        <ContentRow title="Trending Movies" items={trendingMovies} onMovieClick={(id) => handleOpenModal(Number(id), 'movie')} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Trending TV Shows" items={trendingShows} onMovieClick={(id) => handleOpenModal(Number(id), 'tv')} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Popular on Streamlit" items={popularMovies} onMovieClick={(id) => handleOpenModal(Number(id), 'movie')} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Top Rated" items={topRatedMovies} onMovieClick={(id) => handleOpenModal(Number(id), 'movie')} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Upcoming Movies" items={upcomingMovies} onMovieClick={(id) => handleOpenModal(Number(id), 'movie')} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
      </div>

      <ContentDetailModal
        id={selectedContent?.id || null}
        type={selectedContent?.type || 'movie'}
        isOpen={!!selectedContent}
        onClose={handleCloseModal}
        onPlay={handlePlay}
      />
    </main>
  );
}
