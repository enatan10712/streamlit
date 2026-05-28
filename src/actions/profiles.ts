"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getProfiles(userId: string) {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
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

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const profilesCount = await prisma.profile.count({
      where: {
        userId: session.user.id,
      },
    });

    if (profilesCount >= 5) {
      throw new Error("Maximum of 5 profiles reached");
    }

    const profile = await prisma.profile.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    revalidatePath("/profiles");
    return profile;
  } catch (error: any) {
    console.error("CREATE_PROFILE_ERROR", error);
    throw new Error(error.message || "Internal Error");
  }
}

export async function updateProfile(id: string, name: string, image?: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const profile = await prisma.profile.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        image,
      },
    });

    revalidatePath("/profiles");
    return profile;
  } catch (error: any) {
    console.error("UPDATE_PROFILE_ERROR", error);
    throw new Error(error.message || "Internal Error");
  }
}

export async function deleteProfile(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Don't allow deleting the last profile
    const profilesCount = await prisma.profile.count({
      where: {
        userId: session.user.id,
      },
    });

    if (profilesCount <= 1) {
      throw new Error("Cannot delete the last profile");
    }

    await prisma.profile.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/profiles");
    return { success: true };
  } catch (error: any) {
    console.error("DELETE_PROFILE_ERROR", error);
    throw new Error(error.message || "Internal Error");
  }
}
