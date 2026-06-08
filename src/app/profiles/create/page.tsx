"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProfile } from "@/actions/profiles";
import { Loader2, Camera } from "lucide-react";

export default function CreateProfilePage() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createProfile({ name });
      router.push("/profiles");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0d0c1d] px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-4xl font-bold text-white md:text-6xl text-center italic uppercase tracking-tighter">Add Profile</h1>
        <p className="text-gray-400 text-center mb-10">Add a profile for another person watching StreamVault.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="h-32 w-32 md:h-40 md:w-40 bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-white/20">
              <Camera className="h-10 w-10" />
            </div>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-6 text-white text-xl outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading || !name}
              className="flex-1 bg-white text-black font-bold py-3 px-8 rounded hover:bg-white/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
            </button>
            <Link
              href="/profiles"
              className="flex-1 border border-gray-500 text-gray-500 font-bold py-3 px-8 rounded hover:border-white hover:text-white transition-all text-center uppercase tracking-widest text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
