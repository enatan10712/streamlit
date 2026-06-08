import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Users, Film, CreditCard, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContentManagement from "@/components/ContentManagement";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/browse");
  const userCount = await prisma.user.count();
  const contentCount = await prisma.content.count();
  const activeSubs = await prisma.subscription.count({ where: { status: "active" } });
  const content = await prisma.content.findMany({ include: { genres: true }, orderBy: { createdAt: 'desc' } });
  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-blue-500" },
    { label: "Active Subscriptions", value: activeSubs, icon: CreditCard, color: "text-green-500" },
    { label: "Total Content", value: contentCount, icon: Film, color: "text-purple-500" },
    { label: "Monthly Revenue", value: `$${activeSubs * 15}`, icon: TrendingUp, color: "text-rose-500" },
  ];
  return (
    <div className="min-h-screen bg-[#0d0c1d]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4"><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <h2 className="text-3xl font-black text-white">{stat.value}</h2>
              </div>
            ))}
          </div>
        </div>
        <ContentManagement initialContent={content} genres={[]} />
      </div>
    </div>
  );
}
