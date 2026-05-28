"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createContent(data: {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  type: "MOVIE" | "TV_SHOW";
  genreIds: string[];
}) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const content = await prisma.content.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        videoUrl: data.videoUrl,
        type: data.type,
        genres: {
          connect: data.genreIds.map(id => ({ id }))
        }
      }
    });

    revalidatePath("/admin");
    revalidatePath("/browse");
    return content;
  } catch (error: any) {
    console.error("CREATE_CONTENT_ERROR", error);
    throw new Error(error.message || "Internal Error");
  }
}
