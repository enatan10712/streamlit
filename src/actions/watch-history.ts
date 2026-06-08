"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateWatchHistory(profileId: string, contentId: string, watchedSeconds: number) {
  try {
    await prisma.watchHistory.upsert({
      where: {
        profileId_contentId_episodeId: {
          profileId,
          contentId,
          episodeId: "none",
        },
      },
      update: { watchedSeconds, lastWatchedAt: new Date() },
      create: { profileId, contentId, episodeId: "none", watchedSeconds },
    });
    revalidatePath("/browse");
  } catch (error) {
    console.error("UPDATE_WATCH_HISTORY_ERROR", error);
  }
}

export async function getContinueWatching(profileId: string) {
  try {
    const history = await prisma.watchHistory.findMany({
      where: { profileId, isCompleted: false },
      include: { content: true },
      orderBy: { lastWatchedAt: "desc" },
      take: 6,
    });
    return history.map((h) => h.content);
  } catch (error) {
    console.error("GET_CONTINUE_WATCHING_ERROR", error);
    return [];
  }
}
