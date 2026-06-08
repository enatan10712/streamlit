'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useWatchListStore } from '@/store/useWatchListStore';
import MovieCard from '@/components/MovieCard';
import { ArrowLeft, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyListPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const { favorites, removeFavorite } = useWatchListStore();

  useEffect(() => {
    if (!user || !currentProfile) {
      router.push('/auth/login');
    }
  }, [user, currentProfile, router]);

  const handlePlayMovie = (id: string | number) => {
    router.push(`/watch/${id}`);
  };

  const handleRemove = (id: string) => {
    removeFavorite(id);
  };

  if (!user || !currentProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/browse"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            My List
          </h1>
          <p className="text-slate-400 mt-2">{favorites.length} items saved</p>
        </div>
      </div>

      {/* Content Grid */}
      {favorites.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <MovieCard
                id={item.id}
                title={item.title}
                posterPath={item.posterPath}
                rating={item.rating}
                onPlay={() => handlePlayMovie(item.id)}
                isFavorite={true}
                onFavoriteToggle={() => handleRemove(item.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
          <p className="text-slate-400 mb-6">Add movies and shows to your list to watch later</p>
          <Link
            href="/browse"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-colors"
          >
            Browse Content
          </Link>
        </div>
      )}
    </div>
  );
}
