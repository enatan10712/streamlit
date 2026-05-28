"use client";

import { Play, Plus, ChevronDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import ContentModal from "./ContentModal";

interface ContentCardProps {
  content: any;
}

export default function ContentCard({ content }: ContentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative aspect-video rounded-md bg-white/5 border border-white/5 overflow-hidden transition-all duration-300 hover:scale-110 hover:z-40 hover:border-primary/50 cursor-pointer shadow-2xl shadow-black/50"
      >
        <img
          src={content.thumbnailUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
          alt={content.title}
          className="w-full h-full object-cover"
        />

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black">
              <Play className="h-4 w-4 fill-current" />
            </div>
            <div className="h-8 w-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors">
              <Plus className="h-4 w-4" />
            </div>
            <div className="flex-1" />
            <div className="h-8 w-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs font-bold text-white line-clamp-1">{content.title}</p>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
            <span className="text-green-500">98% Match</span>
            <span className="border border-white/20 px-1 rounded">{content.rating || "PG-13"}</span>
            <span>{content.duration || "2h 14m"}</span>
          </div>
        </div>
      </div>

      <ContentModal
        content={content}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
