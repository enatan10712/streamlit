"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfileItemProps {
  profile: any;
}

export default function ProfileItem({ profile }: ProfileItemProps) {
  const router = useRouter();
  const { setActiveProfileId } = useProfileStore();

  const handleSelect = () => {
    setActiveProfileId(profile.id);
    router.push("/browse");
  };

  return (
    <div onClick={handleSelect} className="group cursor-pointer">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-transparent transition-all group-hover:border-white md:h-40 md:w-40">
          <div className="flex h-full w-full items-center justify-center bg-primary/20 text-4xl font-bold text-primary">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          {profile.image && (
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <span className="text-xl text-gray-400 group-hover:text-white">{profile.name}</span>
      </div>
    </div>
  );
}
