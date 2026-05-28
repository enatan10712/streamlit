"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Play, Shield, Zap, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0d0c1d] overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-12"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-[#7c3aed]/20 blur-[120px] -z-10 opacity-50" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] text-xs font-bold tracking-widest uppercase"
          >
            <Zap className="h-3 w-3" />
            Next-Gen Streaming Platform
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1]"
          >
            Unlimited movies, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#f43f5e]">
              TV shows, and more.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the ultimate cinematic vault. High-quality streaming, offline viewing,
            and personalized recommendations starting at just $9.99/month.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
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
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto px-4 md:px-12 py-20 border-t border-white/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureItem
            icon={Globe}
            title="Watch Everywhere"
            description="Stream on your phone, tablet, laptop, and TV without extra charges."
          />
          <FeatureItem
            icon={Shield}
            title="Create Profiles for Kids"
            description="Send kids on adventures with their favorite characters in a space made just for them."
            color="text-[#f43f5e]"
            bgColor="bg-[#f43f5e]/10"
          />
          <FeatureItem
            icon={Play}
            title="Download & Go"
            description="Save your favorites easily and always have something to watch offline."
          />
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-20 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} StreamVault Inc. All rights reserved. Built with Next.js 16.
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, description, color = "text-[#7c3aed]", bgColor = "bg-[#7c3aed]/10" }: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="space-y-4"
    >
      <div className={`h-12 w-12 rounded-2xl ${bgColor} flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
