"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ContentCard from "@/components/ContentCard";
import axios from "axios";
import { Loader2, Search as SearchIcon } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <SearchIcon className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-xl">Search for movies, TV shows, or genres.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl text-gray-400">
        Showing results for: <span className="text-white font-bold italic">&quot;{query}&quot;</span>
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No results found for your search.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0d0c1d]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-32 pb-20">
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
