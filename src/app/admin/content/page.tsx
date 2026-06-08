import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContentManagement() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/browse");
  const contentList = await prisma.content.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="min-h-screen bg-[#0d0c1d]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all">
            <Plus className="h-5 w-5" /> Add Content
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentList.map((content) => (
            <div key={content.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-video relative">
                <img src={content.thumbnailUrl} alt={content.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">{content.type}</div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-white font-bold mb-2">{content.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{content.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
