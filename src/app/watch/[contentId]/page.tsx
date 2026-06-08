import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import WatchClient from "@/components/WatchClient";

export const dynamic = "force-dynamic";

interface WatchPageProps {
  params: Promise<{ contentId: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { contentId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  });

  const isActive = user?.subscription?.status === "active";

  if (!isActive && !contentId.startsWith("mock-")) {
     // For demo purposes, we allow viewing mock content even without sub
     // but in a real app, you'd redirect
     // redirect("/subscribe");
  }

  const content = await prisma.content.findUnique({ where: { id: contentId } });

  if (!content && !contentId.startsWith("mock-")) notFound();

  const videoData = content || {
    id: contentId,
    title: "Cosmic Signal",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
  };

  return <WatchClient videoUrl={videoData.videoUrl || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"} title={videoData.title} poster={videoData.thumbnailUrl} />;
}
