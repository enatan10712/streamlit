import Link from "next/link";
import { ChevronRight, Play, Shield, Zap, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0d0c1d] overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-12">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-[#7c3aed]/20 blur-[120px] -z-10 opacity-50" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] text-xs font-bold tracking-widest uppercase animate-fade-in">
            <Zap className="h-3 w-3" />
            Next-Gen Streaming Platform
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1]">
            Unlimited movies, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#f43f5e]">
              TV shows, and more.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Experience the ultimate cinematic vault. High-quality streaming, offline viewing,
            and personalized recommendations starting at just $9.99/month.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="group relative flex items-center gap-2 bg-[#7c3aed] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#7c3aed]/90 transition-all shadow-xl shadow-[#7c3aed]/20"
            >
              Get Started Free
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/browse"
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              <Play className="h-5 w-5 fill-current" />
              Watch Demo
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed]">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Watch Everywhere</h3>
            <p className="text-gray-400 leading-relaxed">
              Stream on your phone, tablet, laptop, and TV without extra charges.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#f43f5e]/10 flex items-center justify-center text-[#f43f5e]">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Create Profiles for Kids</h3>
            <p className="text-gray-400 leading-relaxed">
              Send kids on adventures with their favorite characters in a space made just for them.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed]">
              <Play className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Download & Go</h3>
            <p className="text-gray-400 leading-relaxed">
              Save your favorites easily and always have something to watch offline.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-20 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} StreamVault Inc. All rights reserved. Built with Next.js 16.
        </p>
      </div>
    </div>
  );
}
