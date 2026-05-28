"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateWatchHistory(profileId: string, contentId: string, episodeId: string | null, watchedSeconds: number, isCompleted: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  // Verify profile belongs to user
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { userId: true }
  });

  if (!profile || profile.userId !== session.user.id) {
    throw new Error("Invalid profile");
  }

  // Use undefined for null fields in Prisma where unique constraints are involved
  // or handle the types explicitly
  const history = await prisma.watchHistory.upsert({
    where: {
      profileId_contentId_episodeId: {
        profileId,
        contentId: (episodeId ? undefined : contentId) as any,
        episodeId: (episodeId || undefined) as any
      }
    },
    update: {
      watchedSeconds,
      isCompleted,
      lastWatchedAt: new Date()
    },
    create: {
      profileId,
      contentId: episodeId ? null : contentId,
      episodeId: episodeId || null,
      watchedSeconds,
      isCompleted
    }
  });

  return history;
}

export async function getContinueWatching(profileId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const history = await prisma.watchHistory.findMany({
    where: {
      profileId,
      isCompleted: false
    },
    include: {
      content: true,
      episode: {
        include: {
          season: {
            include: {
              content: true
            }
          }
        }
      }
    },
    orderBy: {
      lastWatchedAt: 'desc'
    },
    take: 12
  });

  return history.map(h => {
    if (h.episode) {
      return {
        ...h.episode.season.content,
        episodeTitle: h.episode.title,
        watchedSeconds: h.watchedSeconds,
        duration: h.episode.duration,
        type: 'EPISODE'
      };
    }
    return {
      ...h.content,
      watchedSeconds: h.watchedSeconds,
      type: 'MOVIE'
    };
  });
}
