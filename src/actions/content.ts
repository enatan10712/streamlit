"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleWatchlist(profileId: string, contentId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
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
        where: { id: existing.id },
      });
    } else {
      await prisma.watchlist.create({
        data: { profileId, contentId },
      });
    }

    revalidatePath("/browse");
    return { success: true };
  } catch (error) {
    console.error("TOGGLE_WATCHLIST_ERROR", error);
    return { success: false };
  }
}

export async function toggleLike(profileId: string, contentId: string, value: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    const existing = await prisma.rating.findUnique({
      where: {
        profileId_contentId: {
          profileId,
          contentId,
        },
      },
    });

    if (existing && existing.value === value) {
      await prisma.rating.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.rating.upsert({
        where: {
          profileId_contentId: {
            profileId,
            contentId,
          },
        },
        update: { value },
        create: { profileId, contentId, value },
      });
    }

    revalidatePath("/browse");
    return { success: true };
  } catch (error) {
    console.error("TOGGLE_LIKE_ERROR", error);
    return { success: false };
  }
}
