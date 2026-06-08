"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/Navbar";
import ContentCard from "@/components/ContentCard";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query || query.length < 3) return [];
      const { data } = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: !!query && query.length >= 3,
  });

  return (
    <div className="min-h-screen bg-[#0d0c1d]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Search className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">
              {query ? `Results for "${query}"` : "Search"}
            </h1>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-gray-400 animate-pulse">Searching the vault...</p>
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {results.map((item: any) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : query && query.length >= 3 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                 <Search className="h-10 w-10 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-white">No results found</h2>
              <p className="text-gray-400 max-w-xs">
                We couldn&apos;t find anything matching your search. Try different keywords or browse genres.
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
               <p className="text-gray-400">Start typing to search for movies and shows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
