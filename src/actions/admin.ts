"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteContent(contentId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  try {
    await prisma.content.delete({
      where: { id: contentId },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("DELETE_CONTENT_ERROR", error);
    return { success: false };
  }
}

export async function getAdminStats() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const [userCount, contentCount, activeSubs, recentPayments] = await Promise.all([
    prisma.user.count(),
    prisma.content.count(),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { subscription: { include: { user: true } } },
    }),
  ]);

  return {
    userCount,
    contentCount,
    activeSubs,
    revenue: activeSubs * 15,
    recentPayments,
  };
}
