"use client";

import { X, Play, Plus, ThumbsUp, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ContentModalProps {
  content: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentModal({ content, isOpen, onClose }: ContentModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Hero Section */}
        <div className="relative aspect-video w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent z-10" />
          <img
            src={content.thumbnailUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-8 left-8 z-20 space-y-4 max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic">
              {content.title}
            </h2>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/watch/${content.id}`)}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-white/90 transition-all"
              >
                <Play className="h-6 w-6 fill-current" />
                Play
              </button>
              <button className="h-12 w-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-all">
                <Plus className="h-6 w-6" />
              </button>
              <button className="h-12 w-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-all">
                <ThumbsUp className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="text-green-500">98% Match</span>
              <span className="text-gray-400">{content.releaseDate?.split("-")[0] || "2024"}</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">4K Ultra HD</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">HDR</span>
            </div>

            <p className="text-lg text-white leading-relaxed">
              {content.description}
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex gap-2">
              <span className="text-gray-500 italic">Cast:</span>
              <span className="text-gray-300">Vault Originals, AI Talent</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 italic">Genres:</span>
              <span className="text-gray-300">Sci-Fi, Adventure, Thriller</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 italic">This content is:</span>
              <span className="text-gray-300">Exciting, Mind-bending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
