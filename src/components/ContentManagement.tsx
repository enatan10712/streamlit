"use client";

import { useState } from "react";
import AddContentModal from "@/components/AddContentModal";
import { Plus, Trash2, Edit, Film } from "lucide-react";
import { deleteContent } from "@/actions/admin";

export default function ContentManagement({ initialContent, genres }: { initialContent: any[], genres: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentList, setContentList] = useState(initialContent);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this content from the vault?")) {
      const res = await deleteContent(id);
      if (res.success) {
        setContentList(contentList.filter(item => item.id !== id));
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Film className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-white">Content Library</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
        >
          <Plus className="h-4 w-4" />
          Inject Content
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentList.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
            <div className="aspect-video relative">
              <img src={item.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                <button className="p-3 bg-white rounded-full text-black hover:bg-white/80 transition-colors shadow-xl">
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition-colors shadow-xl"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                  {item.type}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-white font-bold text-lg truncate">{item.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.genres?.map((g: any) => (
                  <span key={g.id} className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                    #{g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {contentList.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-white/5 rounded-2xl py-20 flex flex-col items-center justify-center text-center gap-4">
             <Film className="h-12 w-12 text-gray-700" />
             <p className="text-gray-500 font-medium italic">No content in the vault yet.</p>
          </div>
        )}
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
