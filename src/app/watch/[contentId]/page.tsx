'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import WatchClient from '@/components/WatchClient';
import { tmdbAPI, Movie } from '@/lib/tmdb';

// Demo video sources
const DEMO_VIDEOS: Record<string, string> = {
  'demo-1': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'demo-2': 'https://test-streams.mux.dev/VZtzUGoiVv45OYxKzwjuJ6OilMY/VZtzUGoiVv45OYxKzwjuJ6OilMY.m3u8',
  'demo-3': 'https://test-streams.mux.dev/RCJLOl2Y1SjFDgvj5eIqVU1XE6FhIXcVKY/RCJLOl2Y1SjFDgvj5eIqVU1XE6FhIXcVKY.m3u8',
};

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.contentId as string;
  const { user } = useAuthStore();
  const { currentProfile } = useProfileStore();

  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !currentProfile) {
      router.push('/auth/login');
      return;
    }

    const loadMovieData = async () => {
      try {
        setLoading(true);
        // If it's a demo content ID, use demo data
        if (contentId.startsWith('demo-')) {
          setMovieData({
            id: parseInt(contentId.split('-')[1]) || 1,
            title: 'Demo Content',
            overview: 'This is demo content for testing the video player.',
            poster_path: null,
            backdrop_path: null,
            release_date: new Date().toISOString().split('T')[0],
            vote_average: 8.5,
            genre_ids: [],
            popularity: 100,
          });
        } else {
          // Otherwise, fetch from TMDB
          const { data } = await tmdbAPI.getMovieDetail(parseInt(contentId));
          setMovieData(data);
        }
      } catch {
        setError('Failed to load movie data');
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [contentId, user, currentProfile, router]);

  if (!user || !currentProfile) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Failed to load content</h1>
          <Link
            href="/browse"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  // Get video URL - use demo video or construct from ID
  const videoUrl =
    DEMO_VIDEOS[`demo-${movieData.id % 3 + 1}`] ||
    DEMO_VIDEOS['demo-1'];

  return (
    <WatchClient
      videoUrl={videoUrl}
      title={movieData.title}
      poster={movieData.poster_path}
      movieId={movieData.id}
    />
  );
}
