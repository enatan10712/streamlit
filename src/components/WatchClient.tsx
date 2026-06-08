"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ListPlus } from "lucide-react";
import "vidstack/player";
import "vidstack/player/ui";
import "vidstack/player/layouts/default";
import { getImageUrl } from "@/lib/tmdb";
import { updateContinueWatching } from "@/lib/firestore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useWatchListStore } from "@/store/useWatchListStore";

interface WatchClientProps {
  videoUrl: string;
  title: string;
  poster: string | null;
  movieId?: number;
}

interface VidstackPlayerElement extends HTMLElement {
  currentTime?: number;
  duration?: number;
}

export default function WatchClient({ videoUrl, title, poster, movieId }: WatchClientProps) {
  const playerRef = useRef<HTMLElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [duration, setDuration] = useState(0);
  const { user } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const { addFavorite } = useWatchListStore();

  useEffect(() => {
    const player = playerRef.current as VidstackPlayerElement | null;
    if (!player) return;

    const saveProgress = (currentTime: number, mediaDuration: number) => {
      if (!user || !currentProfile || !movieId || !mediaDuration) return;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        updateContinueWatching(user.uid, currentProfile.id, {
          contentId: movieId.toString(),
          contentType: "movie",
          title,
          posterPath: poster || "",
          progress: Math.round(currentTime),
          duration: Math.round(mediaDuration),
          lastWatchedAt: Date.now(),
        }).catch((error) => console.error("Error saving progress:", error));
      }, 1200);
    };

    const handleTimeUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const currentTime = detail?.currentTime ?? player.currentTime ?? 0;
      const mediaDuration = detail?.duration ?? player.duration ?? duration;
      if (mediaDuration) setDuration(mediaDuration);
      saveProgress(currentTime, mediaDuration);
    };

    player.addEventListener("time-update", handleTimeUpdate);
    player.addEventListener("duration-change", handleTimeUpdate);

    return () => {
      player.removeEventListener("time-update", handleTimeUpdate);
      player.removeEventListener("duration-change", handleTimeUpdate);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [currentProfile, duration, movieId, poster, title, user]);

  const posterUrl = getImageUrl(poster, "w1280");

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute left-4 top-4 z-50 flex items-center gap-3">
        <Link
          href="/browse"
          className="rounded-full bg-black/60 p-3 text-white backdrop-blur transition hover:bg-black/90"
          aria-label="Back to browse"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="rounded-full bg-black/60 px-4 py-2 text-sm font-semibold backdrop-blur">
          {title}
        </div>
      </div>

      <section className="flex min-h-screen items-center justify-center">
        <media-player
          ref={playerRef}
          className="aspect-video w-full bg-black [--media-brand:var(--primary)]"
          title={title}
          src={videoUrl}
          poster={posterUrl}
          controls
          playsInline
        >
          <media-provider>
            <track
              default
              kind="subtitles"
              label="English"
              src="/sample-subtitles.vtt"
              srcLang="en"
            />
          </media-provider>
          <media-video-layout />
        </media-player>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent px-5 pb-8 pt-24 md:px-12">
        <div className="pointer-events-auto max-w-3xl">
          <h1 className="text-3xl font-black md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300 md:text-base">
            Demo playback includes fullscreen, volume, speed controls, subtitles, and saved progress for Continue Watching.
          </p>
          <button
            type="button"
            onClick={() => {
              if (!movieId) return;
              addFavorite({
                id: movieId.toString(),
                type: "movie",
                title,
                posterPath: poster || "",
                rating: 0,
                addedAt: Date.now(),
              });
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ListPlus className="h-4 w-4" />
            Add to My List
          </button>
        </div>
      </div>
    </main>
  );
}
