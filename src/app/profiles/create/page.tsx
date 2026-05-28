"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile } from "@/actions/profiles";

export default function CreateProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createProfile(name);
      router.push("/profiles");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0c1d] px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-[#1a192f] p-8 shadow-2xl border border-white/5">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#7c3aed]">Add Profile</h2>
          <p className="mt-2 text-sm text-gray-400">Add a profile for another person watching StreamVault.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-lg bg-[#0d0c1d] border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none transition-all"
                placeholder="Profile Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-white/10 py-3 font-semibold text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name}
              className="flex-1 rounded-lg bg-[#7c3aed] py-3 font-semibold text-white hover:bg-[#7c3aed]/90 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-[#1a192f] disabled:opacity-50 transition-all"
            >
              {loading ? "Adding..." : "Add Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
