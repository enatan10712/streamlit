"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AddContentModal({ genres, onClose }: { genres: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    type: "MOVIE" as "MOVIE" | "TV_SHOW",
    genreIds: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic would go here
      onClose();
    } catch (error) {
      alert("Failed to create content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#1a192f] rounded-2xl p-8 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Add New Content</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <input
              required
              className="w-full bg-[#0d0c1d] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#7c3aed]"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              required
              rows={4}
              className="w-full bg-[#0d0c1d] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#7c3aed]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Type</label>
              <select
                className="w-full bg-[#0d0c1d] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#7c3aed]"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="MOVIE">Movie</option>
                <option value="TV_SHOW">TV Show</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Thumbnail URL</label>
              <input
                required
                className="w-full bg-[#0d0c1d] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#7c3aed]"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => {
                    const ids = formData.genreIds.includes(genre.id)
                      ? formData.genreIds.filter(id => id !== genre.id)
                      : [...formData.genreIds, genre.id];
                    setFormData({ ...formData, genreIds: ids });
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    formData.genreIds.includes(genre.id)
                      ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                  )}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] text-white py-3 rounded-lg font-bold hover:bg-[#7c3aed]/90 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Creating..." : "Create Content"}
          </button>
        </form>
      </div>
    </div>
  );
}
