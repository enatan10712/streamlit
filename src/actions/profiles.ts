"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getProfiles(userId: string) {
  try {
    const profiles = await prisma.profile.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return profiles;
  } catch (error) {
    console.error("GET_PROFILES_ERROR", error);
    return [];
  }
}

export async function createProfile(name: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");
    const profilesCount = await prisma.profile.count({ where: { userId: session.user.id } });
    if (profilesCount >= 5) throw new Error("Maximum of 5 profiles reached");
    const profile = await prisma.profile.create({ data: { name, userId: session.user.id } });
    revalidatePath("/profiles");
    return profile;
  } catch (error: any) {
    console.error("CREATE_PROFILE_ERROR", error);
    throw new Error(error.message || "Internal Error");
  }
}
