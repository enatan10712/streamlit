import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProfiles } from "@/actions/profiles";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProfilesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  const profiles = await getProfiles(session.user.id);
  return (
    <div className="flex h-screen items-center justify-center bg-[#0d0c1d]">
      <div className="flex flex-col items-center">
        <h1 className="mb-10 text-4xl font-semibold text-white md:text-6xl">Who&apos;s watching?</h1>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {profiles.map((profile) => (
            <Link key={profile.id} href="/browse" className="group">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-transparent transition-all group-hover:border-white md:h-40 md:w-40">
                  <div className="flex h-full w-full items-center justify-center bg-primary/20 text-4xl font-bold text-primary">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  {profile.image && <Image src={profile.image} alt={profile.name} fill className="object-cover" />}
                </div>
                <span className="text-xl text-gray-400 group-hover:text-white">{profile.name}</span>
              </div>
            </Link>
          ))}
          {profiles.length < 5 && (
            <Link href="/profiles/create" className="group">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 transition-all group-hover:border-white/50 group-hover:bg-white/10 md:h-40 md:w-40">
                  <span className="text-4xl text-white/30 group-hover:text-white/50">+</span>
                </div>
                <span className="text-xl text-gray-400 group-hover:text-white">Add Profile</span>
              </div>
            </Link>
          )}
        </div>
        <button className="mt-16 border border-gray-500 px-6 py-2 text-gray-500 transition-all hover:border-white hover:text-white">Manage Profiles</button>
      </div>
    </div>
  );
}
