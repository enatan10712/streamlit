"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";
import MovieCard from "@/components/MovieCard";
import { SearchResult, tmdbAPI } from "@/lib/tmdb";
import { debounce } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading: authLoading } = useAuthStore();
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, router, user]);

  const runSearch = useCallback(async (value: string, nextPage = 1) => {
    if (!value.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await tmdbAPI.searchMulti(value.trim(), nextPage);
      const filtered = (data.results || []).filter((item: SearchResult) => item.media_type === "movie" || item.media_type === "tv");
      setResults((current) => nextPage === 1 ? filtered : [...current, ...filtered]);
      setHasMore(nextPage < (data.total_pages || 1));
      setPage(nextPage);
    } catch (error) {
      console.error(error);
      toast.error("Search failed. Check your TMDB key.");
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(() => debounce((value: string) => runSearch(value, 1), 450), [runSearch]);

  useEffect(() => {
    if (!initialQuery) return;
    const timeout = window.setTimeout(() => {
      runSearch(initialQuery, 1);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [initialQuery, runSearch]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) runSearch(query, page + 1);
    }, { rootMargin: "600px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, page, query, runSearch]);

  const handleSearch = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  if (authLoading || !user) return null;

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-white md:px-12">
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/browse" className="rounded-full bg-white/10 p-2 transition hover:bg-white/20" aria-label="Back to browse">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-4xl font-black">Search</h1>
        </div>

        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search movies, shows, actors..."
            className="w-full rounded-lg border border-white/15 bg-white/10 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-primary"
          />
        </div>
      </div>

      {query && (
        <div className="mb-6 flex flex-wrap gap-2">
          {["Action", "Drama", "Comedy", "Thriller", "Sci-Fi"].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSearch(suggestion)}
              className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/20"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((result) => (
            <MovieCard
              key={`${result.media_type}-${result.id}`}
              id={result.id}
              title={result.title || result.name || "Untitled"}
              posterPath={result.poster_path}
              rating={result.vote_average || 0}
              onPlay={() => router.push(`/watch/${result.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <h2 className="text-xl font-bold">{query ? "No results found" : "Search Streamlit"}</h2>
          <p className="mx-auto mt-2 max-w-sm text-zinc-400">
            {query ? "Try another title, person, or genre." : "Start typing to find movies and TV shows from TMDB."}
          </p>
        </div>
      )}

      {loading && (
        <div className="py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      )}
      <div ref={sentinelRef} className="h-8" />
    </main>
  );
}
