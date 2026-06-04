import Navbar from "@/components/Navbar";
import { Play, Info } from "lucide-react";
import prisma from "@/lib/prisma";
import ContentCard from "@/components/ContentCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getContinueWatching } from "@/actions/watch-history";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const session = await getServerSession(authOptions);

  let trendingContent: any[] = [];
  let actionMovies: any[] = [];
  let profiles: any[] = [];
  let continueWatching: any[] = [];

  try {
    profiles = await prisma.profile.findMany({
      where: { userId: session?.user?.id },
    });

    const activeProfile = profiles[0];
    continueWatching = activeProfile
      ? await getContinueWatching(activeProfile.id)
      : [];

    trendingContent = await prisma.content.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    actionMovies = await prisma.content.findMany({
      where: { type: "MOVIE" },
      take: 6,
    });
  } catch (e) {
    console.error("Database unavailable, falling back to mock data:", e);
  }

  const mockContent = Array.from({ length: 6 }).map((_, i) => ({
    id: `mock-${i}`,
    title: `Vault Original #${i + 1}`,
    description: "When a mysterious signal from the edge of the galaxy reaches Earth, a team of elite explorers must embark on a journey that will redefine humanity's place in the universe.",
    thumbnailUrl: `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop&sig=${i}`,
    duration: "2h 15m",
    rating: "PG-13",
    type: "MOVIE"
  }));

  const displayTrending = trendingContent.length > 0 ? trendingContent : mockContent;
  const displayAction = actionMovies.length > 0 ? actionMovies : mockContent;

  return (
    <div className="relative min-h-screen bg-[#0d0c1d]">
      <Navbar />
      <div className="relative h-[85vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c1d] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c1d]/60 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Hero"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col justify-end pb-24 px-4 md:px-12 max-w-3xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#7c3aed] text-white text-[10px] font-black px-2 py-0.5 rounded italic">VAULT</span>
            <span className="text-white text-xs font-bold tracking-[0.3em] uppercase">Original</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">COSMIC SIGNAL</h1>
          <p className="text-lg text-gray-200 leading-relaxed drop-shadow-lg max-w-xl">
            When a mysterious signal from the edge of the galaxy reaches Earth, a team of elite explorers must embark on a journey that will redefine humanity&apos;s place in the universe.
          </p>
        </div>
      </div>
      <div className="relative z-30 -mt-32 pb-20 space-y-12 px-4 md:px-12">
        {continueWatching.length > 0 && <ContentRow title="Continue Watching" items={continueWatching} />}
        <ContentRow title="Trending Now" items={displayTrending} />
        <ContentRow title="Action Blockbusters" items={displayAction} />
        <ContentRow title="New Releases" items={displayTrending.slice().reverse()} />
      </div>
    </div>
  );
}

function ContentRow({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2 group cursor-pointer">
        {title}
        <span className="text-xs text-primary font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity ml-2">Explore All</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => <ContentCard key={item.id} content={item} />)}
      </div>
    </div>
  );
}
