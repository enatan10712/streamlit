"use client";

import { useState } from "react";
import AddContentModal from "@/components/AddContentModal";
import { Plus, Trash2, Edit } from "lucide-react";

export default function ContentManagement({ initialContent, genres }: { initialContent: any[], genres: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const content = initialContent;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Library</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#7c3aed]/90 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Content
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
            <div className="aspect-video relative">
              <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt={item.title} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="p-2 bg-white rounded-full text-black hover:bg-white/80 transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="p-2 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold truncate">{item.title}</h3>
              <p className="text-gray-400 text-xs mt-1">{item.type} • {item.genres?.map((g: any) => g.name).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddContentModal
          genres={genres}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
