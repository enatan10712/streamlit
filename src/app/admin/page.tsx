import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Users, Film, CreditCard, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContentManagement from "@/components/ContentManagement";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/browse");
  }

  const userCount = await prisma.user.count();
  const contentCount = await prisma.content.count();
  const activeSubs = await prisma.subscription.count({ where: { status: "active" } });

  const content = await prisma.content.findMany({
    include: { genres: true },
    orderBy: { createdAt: 'desc' }
  });

  const genres = await prisma.genre.findMany();

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
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <h2 className="text-3xl font-black text-white">{stat.value}</h2>
              </div>
            ))}
          </div>
        </div>

        <ContentManagement initialContent={content} genres={genres} />

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
            <button className="text-[#7c3aed] text-sm font-bold hover:underline">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-gray-500 font-medium text-sm">User</th>
                  <th className="pb-4 text-gray-500 font-medium text-sm">Status</th>
                  <th className="pb-4 text-gray-500 font-medium text-sm">Joined</th>
                  <th className="pb-4 text-gray-500 font-medium text-sm">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(await prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } })).map((user) => (
                  <tr key={user.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] text-xs font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-white font-medium">{user.name || user.email}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded">Active</span>
                    </td>
                    <td className="py-4 text-gray-400 text-sm">{user.createdAt.toLocaleDateString()}</td>
                    <td className="py-4 text-gray-400 text-sm">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
