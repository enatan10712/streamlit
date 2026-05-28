"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function rateContent(contentId: string, profileId: string, value: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const rating = await prisma.rating.upsert({
      where: {
        profileId_contentId: {
          profileId,
          contentId,
        },
      },
      update: {
        value,
      },
      create: {
        profileId,
        contentId,
        value,
      },
    });

    return rating;
  } catch (error) {
    console.error("RATE_CONTENT_ERROR", error);
    throw error;
  }
}

export async function toggleWatchlist(contentId: string, profileId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const existing = await prisma.watchlist.findUnique({
      where: {
        profileId_contentId: {
          profileId,
          contentId,
        },
      },
    });

    if (existing) {
      await prisma.watchlist.delete({
        where: {
          id: existing.id,
        },
      });
      return { added: false };
    } else {
      await prisma.watchlist.create({
        data: {
          profileId,
          contentId,
        },
      });
      return { added: true };
    }
  } catch (error) {
    console.error("TOGGLE_WATCHLIST_ERROR", error);
    throw error;
  }
}
