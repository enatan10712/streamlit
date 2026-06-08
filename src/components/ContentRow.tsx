"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import type { Movie, TVShow } from "@/lib/tmdb";

type RowItem = Movie | TVShow;

interface ContentRowProps {
  title: string;
  items: RowItem[];
  onMovieClick?: (id: number | string) => void;
  onFavoriteToggle?: (id: number | string) => void;
  isFavorite?: (id: number | string) => boolean;
  showProgress?: boolean;
}

const getTitle = (item: RowItem) => "title" in item ? item.title : item.name;

export default function ContentRow({
  title,
  items,
  onMovieClick,
  onFavoriteToggle,
  isFavorite,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8,
      behavior: "smooth",
    });
    window.setTimeout(updateScrollState, 350);
  };

  if (!items.length) return null;

  return (
    <section className="group/row space-y-3" aria-label={title}>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll("left")}
            className="absolute -left-3 top-0 z-20 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <span className="rounded-full bg-black/70 p-2 text-white">
              <ChevronLeft className="h-6 w-6" />
            </span>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth pb-4 md:gap-4"
        >
          {items.map((item) => (
            <div
              key={`${"name" in item ? "tv" : "movie"}-${item.id}`}
              className="w-[42vw] shrink-0 sm:w-[28vw] md:w-[20vw] lg:w-[15vw] xl:w-[12vw]"
            >
              <MovieCard
                id={item.id}
                title={getTitle(item)}
                posterPath={item.poster_path}
                rating={item.vote_average || 0}
                onPlay={() => onMovieClick?.(item.id)}
                isFavorite={isFavorite?.(item.id)}
                onFavoriteToggle={() => onFavoriteToggle?.(item.id)}
              />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll("right")}
            className="absolute -right-3 top-0 z-20 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
          >
            <span className="rounded-full bg-black/70 p-2 text-white">
              <ChevronRight className="h-6 w-6" />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
