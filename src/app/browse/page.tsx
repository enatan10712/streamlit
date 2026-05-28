import Navbar from "@/components/Navbar";
import { Play, Info, Plus } from "lucide-react";

export default function BrowsePage() {
  return (
    <div className="relative min-h-screen bg-[#0d0c1d]">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="relative h-[85vh] w-full">
        {/* Background Overlay Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c1d] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c1d]/60 via-transparent to-transparent z-10" />

        {/* Mock Hero Background */}
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center overflow-hidden">
          <div className="text-white/5 text-[20rem] font-black rotate-12 select-none">
            TRENDING
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-end pb-24 px-4 md:px-12 max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Vault Originals
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed drop-shadow-lg">
            When a mysterious signal from the edge of the galaxy reaches Earth,
            a team of elite explorers must embark on a journey that will redefine
            humanity's place in the universe.
          </p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-white/90 transition-all">
              <Play className="h-6 w-6 fill-current" />
              Play
            </button>
            <button className="flex items-center gap-2 bg-gray-500/50 text-white px-8 py-3 rounded-md font-bold backdrop-blur-md hover:bg-gray-500/70 transition-all border border-white/10">
              <Info className="h-6 w-6" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Content Rows Placeholders */}
      <div className="relative z-30 -mt-32 pb-20 space-y-12 px-4 md:px-12">
        <ContentRow title="Trending Now" />
        <ContentRow title="Continue Watching" />
        <ContentRow title="Action Blockbusters" />
        <ContentRow title="Epic Dramas" />
      </div>
    </div>
  );
}

function ContentRow({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        {title}
        <span className="text-xs text-primary font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          Explore All
        </span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="group relative aspect-video rounded-md bg-white/5 border border-white/5 overflow-hidden transition-all duration-300 hover:scale-110 hover:z-40 hover:border-primary/50 cursor-pointer shadow-2xl shadow-black/50"
          >
            <div className="absolute inset-0 flex items-center justify-center text-white/10 font-bold italic">
              VAULT #{i}
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black">
                  <Play className="h-4 w-4 fill-current" />
                </div>
                <div className="h-8 w-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">Title Placeholder</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                <span className="text-green-500">98% Match</span>
                <span className="border border-white/20 px-1 rounded">PG-13</span>
                <span>2h 14m</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
