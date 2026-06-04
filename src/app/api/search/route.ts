import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    if (!query || query.length < 3) return NextResponse.json([]);
    const content = await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
    });
    return NextResponse.json(content);
  } catch (error: any) {
    console.error("SEARCH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
