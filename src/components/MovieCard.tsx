'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Heart } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  id: string | number;
  title: string;
  posterPath: string | null;
  rating: number;
  onPlay?: () => void;
  onAddToList?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function MovieCard({
  title,
  posterPath,
  rating,
  onPlay,
  onAddToList,
  isFavorite = false,
  onFavoriteToggle,
}: MovieCardProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      className="group relative cursor-pointer h-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={{ scale: 1.05, zIndex: 20 }}
    >
      {/* Poster Image */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-slate-800">
        <Image
          src={getImageUrl(posterPath, 'w342')}
          alt={title}
          fill
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Actions */}
        {hovering && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          >
            <button
              onClick={onPlay}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full p-3 shadow-lg transform hover:scale-110 transition-transform"
            >
              <Play className="w-5 h-5 text-white fill-white" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={onAddToList}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={onFavoriteToggle}
                className={`rounded-full p-2 backdrop-blur-sm transition-colors ${
                  isFavorite
                    ? 'bg-red-500/30 hover:bg-red-500/40'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Heart className="w-4 h-4 text-white" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Title and Rating */}
      <div className="mt-3">
        <h3 className="font-semibold text-white truncate text-sm md:text-base">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.round(rating / 2) ? 'text-yellow-400' : 'text-slate-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-slate-400">{rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
}
