"use client";

import { Play, Plus, ChevronDown, ThumbsUp, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ContentModal from "./ContentModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  content: any;
}

export default function ContentCard({ content }: ContentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(false);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsModalOpen(true)}
        className="relative aspect-video rounded-md cursor-pointer"
      >
        <img
          src={content.thumbnailUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
          alt={content.title}
          className="w-full h-full object-cover rounded-md"
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -50 }}
              exit={{ opacity: 0, scale: 0.8, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 z-50 bg-[#181818] rounded-md shadow-2xl border border-white/10"
            >
              <div className="relative aspect-video w-full">
                {content.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={content.videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    className="w-full h-full object-cover rounded-t-md"
                  />
                ) : (
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="w-full h-full object-cover rounded-t-md"
                  />
                )}

                <div className="absolute top-2 right-2 flex gap-2">
                   <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="h-6 w-6 rounded-full bg-black/50 flex items-center justify-center text-white border border-white/20 hover:bg-black/70"
                   >
                     {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                   </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-white/80 transition-colors">
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </div>
                  <div className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1" />
                  <div className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="text-green-500">98% Match</span>
                    <span className="border border-white/30 px-1 rounded text-white">{content.rating || "PG-13"}</span>
                    <span className="text-white">{content.duration || "2h 14m"}</span>
                    <span className="border border-white/30 px-1 rounded text-[8px] text-white">HD</span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-1">{content.title}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContentModal
        content={content}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
