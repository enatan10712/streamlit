import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Film, CreditCard, TrendingUp, History } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContentManagement from "@/components/ContentManagement";
import { getAdminStats } from "@/actions/admin";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/browse");

  const statsData = await getAdminStats();
  const content = await prisma.content.findMany({
    include: { genres: true },
    orderBy: { createdAt: 'desc' }
  });
  const genres = await prisma.genre.findMany();

  const stats = [
    { label: "Total Users", value: statsData.userCount, icon: Users, color: "text-blue-500" },
    { label: "Active Subscriptions", value: statsData.activeSubs, icon: CreditCard, color: "text-green-500" },
    { label: "Total Content", value: statsData.contentCount, icon: Film, color: "text-purple-500" },
    { label: "Est. Monthly Revenue", value: `$${statsData.revenue}`, icon: TrendingUp, color: "text-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0c1d]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Vault Control</h1>
            <p className="text-gray-400 mt-1">Manage your content ecosystem and view performance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 p-8 rounded-2xl group hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">{stat.label}</p>
              <h2 className="text-4xl font-black text-white mt-1">{stat.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContentManagement initialContent={content} genres={genres} />
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>

              <div className="space-y-6">
                {statsData.recentPayments.length > 0 ? statsData.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {payment.subscription?.user?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{payment.subscription?.user?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white">${payment.amount / 100}</p>
                      <p className="text-[10px] text-green-500 uppercase font-black tracking-tighter">{payment.status}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm italic py-4">No recent activity found.</p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-white">Need Help?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Vault Control allows you to manage content, monitor subscriptions, and analyze platform health.
              </p>
              <button className="text-primary text-sm font-bold hover:underline">Documentation →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
