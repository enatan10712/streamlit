"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import BrowseSkeleton from "@/components/skeletons/BrowseSkeleton";
import { getImageUrl, Movie, TVShow, tmdbAPI } from "@/lib/tmdb";
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
  const [loading, setLoading] = useState(true);

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
        const [movies, shows, popular, topRated, upcoming] = await Promise.all([
          tmdbAPI.getTrendingMovies(),
          tmdbAPI.getTrendingShows(),
          tmdbAPI.getPopularMovies(),
          tmdbAPI.getTopRatedMovies(),
          tmdbAPI.getUpcomingMovies(),
        ]);
        setTrendingMovies(movies.data.results || []);
        setTrendingShows(shows.data.results || []);
        setPopularMovies(popular.data.results || []);
        setTopRatedMovies(topRated.data.results || []);
        setUpcomingMovies(upcoming.data.results || []);
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
        addedAt: Date.now(),
      });
      toast.success("Added to My List");
    }
  };

  const checkFavorite = (id: string | number) => isFavorite(id.toString());

  if (authLoading || loading || !user || !currentProfile) {
    return <BrowseSkeleton />;
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />

      {featured && (
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
              <Link
                href={`/watch/${featured.id}`}
                className="flex items-center gap-2 rounded-md bg-white/15 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/25"
              >
                <Info className="h-5 w-5" />
                Details
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      <div className="relative z-10 -mt-20 space-y-10 px-5 pb-20 md:px-12">
        <ContentRow title="Trending Movies" items={trendingMovies} onMovieClick={handlePlay} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Trending TV Shows" items={trendingShows} onMovieClick={handlePlay} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Popular on StreamVault" items={popularMovies} onMovieClick={handlePlay} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Top Rated" items={topRatedMovies} onMovieClick={handlePlay} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
        <ContentRow title="Upcoming Movies" items={upcomingMovies} onMovieClick={handlePlay} onFavoriteToggle={handleFavoriteToggle} isFavorite={checkFavorite} />
      </div>
    </main>
  );
}
