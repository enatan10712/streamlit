"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/register", {
        email,
        name,
        password,
      });

      // After registration, sign the user in
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/profiles",
      });
    } catch (err: any) {
      setError(err.response?.data || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0c1d] px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-[#1a192f] p-8 shadow-2xl border border-white/5">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">StreamVault</h2>
          <p className="mt-2 text-sm text-gray-400">Join us today! Create your account.</p>
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
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg bg-[#0d0c1d] border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-lg bg-[#0d0c1d] border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#7c3aed] py-3 font-semibold text-white hover:bg-[#7c3aed]/90 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-[#1a192f] disabled:opacity-50 transition-all"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-[#7c3aed] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
