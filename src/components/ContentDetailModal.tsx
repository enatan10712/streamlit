'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Play, Plus, Check, Star, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, tmdbAPI, MovieDetail } from '@/lib/tmdb';
import { useWatchListStore } from '@/store/useWatchListStore';
import { toast } from 'sonner';

interface ContentDetailModalProps {
  id: number | null;
  type: 'movie' | 'tv';
  isOpen: boolean;
  onClose: () => void;
  onPlay: (id: number) => void;
}

export default function ContentDetailModal({
  id,
  type,
  isOpen,
  onClose,
  onPlay,
}: ContentDetailModalProps) {
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useWatchListStore();

  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = type === 'movie'
          ? await tmdbAPI.getMovieDetail(id)
          : await tmdbAPI.getTVDetail(id);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch details:', error);
        toast.error('Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type, isOpen]);

  if (!isOpen) return null;

  const handleFavoriteToggle = () => {
    if (!data) return;
    const contentId = data.id.toString();
    if (isFavorite(contentId)) {
      removeFavorite(contentId);
      toast.success('Removed from My List');
    } else {
      addFavorite({
        id: contentId,
        type,
          title: data.title || (data as unknown as { name: string }).name,
        posterPath: data.poster_path || '',
        rating: data.vote_average,
        addedAt: Date.now(),
      });
      toast.success('Added to My List');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-zinc-900 rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data ? (
            <div className="overflow-y-auto">
              {/* Hero Section */}
              <div className="relative aspect-video w-full">
                <Image
                  src={getImageUrl(data.backdrop_path, 'original')}
                  alt={data.title || (data as unknown as { name: string }).name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                    {data.title || (data as unknown as { name: string }).name}
                  </h2>

                  <div className="flex flex-wrap gap-4 items-center">
                    <button
                      onClick={() => onPlay(data.id)}
                      className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Play
                    </button>

                    <button
                      onClick={handleFavoriteToggle}
                      className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
                    >
                      {isFavorite(data.id.toString()) ? (
                        <Check className="w-6 h-6 text-green-500" />
                      ) : (
                        <Plus className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-400">
                    <span className="flex items-center gap-1 text-green-500">
                      <Star className="w-4 h-4 fill-current" />
                      {data.vote_average.toFixed(1)} Rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {data.release_date || (data as unknown as { first_air_date: string }).first_air_date}
                    </span>
                    {data.runtime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                      </span>
                    )}
                  </div>

                  <p className="text-lg text-zinc-200 leading-relaxed">
                    {data.overview}
                  </p>

                  {data.cast && data.cast.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Cast</h3>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {data.cast.slice(0, 10).map((person) => (
                          <div key={person.id} className="flex-shrink-0 w-24 text-center">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 bg-zinc-800">
                              {person.profile_path ? (
                                <Image
                                  src={getImageUrl(person.profile_path, 'w185')}
                                  alt={person.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            <p className="text-xs font-bold text-white truncate">{person.name}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{person.character}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-500 uppercase mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {data.status && (
                    <div>
                      <h4 className="text-sm font-bold text-zinc-500 uppercase mb-2">Status</h4>
                      <p className="text-zinc-300">{data.status}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
