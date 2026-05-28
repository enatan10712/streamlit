import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";

interface WatchPageProps {
  params: {
    contentId: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { contentId } = params;

  // Fetch content and subscription status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  });

  const isActive = user?.subscription?.status === "active";
  const tier = user?.subscription?.stripePriceId; // Simple tier check based on priceId

  if (!isActive && !contentId.startsWith("mock-")) {
    redirect("/subscribe");
  }

  const content = await prisma.content.findUnique({
    where: { id: contentId },
  });

  if (!content && !contentId.startsWith("mock-")) {
    notFound();
  }

  const videoData = content || {
    id: contentId,
    title: "Cosmic Signal",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <VideoPlayer
        src={videoData.videoUrl || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
        title={videoData.title}
        poster={videoData.thumbnailUrl}
      />
    </div>
  );
}
