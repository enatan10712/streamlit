"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { createProfile, getProfiles } from "@/lib/firestore";
import { useProfileStore } from "@/store/useProfileStore";
import type { Profile } from "@/store/useAuthStore";

const AVATARS = ["SV", "A1", "B2", "C3", "D4", "K1", "M2", "R3", "Z4", "N5", "Q6", "T7"];

export default function ProfilesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { setProfiles, setCurrentProfile } = useProfileStore();
  const [profiles, setLocalProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("SV");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    const loadProfiles = async () => {
      try {
        setLoading(true);
        const userProfiles = await getProfiles(user.uid);
        setLocalProfiles(userProfiles);
        setProfiles(userProfiles);
      } catch (error) {
        console.error("Failed to load profiles:", error);
        toast.error("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [authLoading, router, setProfiles, user]);

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    router.push("/browse");
  };

  const handleCreateProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) return;
    if (!profileName.trim()) {
      toast.error("Profile name is required");
      return;
    }
    if (profiles.length >= 5) {
      toast.error("Maximum 5 profiles allowed");
      return;
    }

    setCreating(true);
    try {
      const newProfile = await createProfile(user.uid, profileName.trim(), selectedAvatar);
      const nextProfiles = [...profiles, newProfile];
      setLocalProfiles(nextProfiles);
      setProfiles(nextProfiles);
      setShowCreateModal(false);
      setProfileName("");
      setSelectedAvatar("SV");
      toast.success("Profile created");
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create profile");
    } finally {
      setCreating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="text-zinc-300">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.22),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.16),transparent_45%)]" />

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-2 text-5xl font-bold md:text-6xl">Who&apos;s watching?</h1>
          <p className="text-lg text-zinc-400">Select a profile to continue</p>
        </motion.div>

        <div className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {profiles.map((profile, index) => (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => handleSelectProfile(profile)}
              className="group flex flex-col items-center gap-3 rounded-xl p-4 transition hover:bg-white/10"
            >
              <span className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-white/10 bg-gradient-to-br from-primary to-blue-700 text-3xl font-black text-white shadow-lg transition group-hover:scale-105 group-hover:border-white md:h-32 md:w-32">
                {profile.avatar}
              </span>
              <span className="font-semibold text-zinc-200 transition group-hover:text-white">{profile.name}</span>
            </motion.button>
          ))}

          {profiles.length < 5 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowCreateModal(true)}
              className="group flex flex-col items-center gap-3 rounded-xl p-4 transition hover:bg-white/10"
            >
              <span className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-zinc-600 transition group-hover:border-white group-hover:bg-white/5 md:h-32 md:w-32">
                <Plus className="h-12 w-12 text-zinc-500 transition group-hover:text-white" />
              </span>
              <span className="font-semibold text-zinc-400 transition group-hover:text-white">Add Profile</span>
            </motion.button>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/15 bg-surface-elevated p-8 shadow-2xl"
          >
            <h2 className="mb-6 text-2xl font-bold">Create Profile</h2>
            <form onSubmit={handleCreateProfile} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">Profile Name</label>
                <input
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  placeholder="Enter profile name"
                  maxLength={20}
                  disabled={creating}
                  className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-zinc-300">Avatar</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      disabled={creating}
                      className={`rounded-lg p-2 text-sm font-black transition ${
                        selectedAvatar === avatar ? "bg-primary text-white shadow-lg" : "bg-white/10 text-zinc-300 hover:bg-white/20"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="flex-1 rounded-lg border border-white/20 px-4 py-2 font-semibold text-white transition hover:border-white/40 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
