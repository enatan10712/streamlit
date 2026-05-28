"use client";

import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
});

interface WatchClientProps {
  videoUrl: string;
  title: string;
  poster: string;
}

export default function WatchClient({ videoUrl, title, poster }: WatchClientProps) {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <VideoPlayer
        src={videoUrl}
        title={title}
        poster={poster}
      />
    </div>
  );
}
