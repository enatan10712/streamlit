"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Sparkles, Tv, Download, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Tv,
    title: "Watch on any device",
    description: "Stream on your phone, tablet, laptop, and TV without extra costs.",
  },
  {
    icon: Download,
    title: "Download and go",
    description: "Save your favorites easily and always have something to watch.",
  },
  {
    icon: Shield,
    title: "Safe for kids",
    description: "Adventures in a space made just for them, with parental controls built in.",
  },
];

const MARQUEE_ITEMS = [
  "4K HDR", "Dolby Atmos", "Exclusive Originals", "Offline Mode", "Zero Ads", "Global Library",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function LandingHero() {
  return (
    <div className="min-h-screen bg-background text-white mesh-bg overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-violet-600/15 blur-[100px] animate-float" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-900/25 blur-[90px]" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 z-50 w-full px-4 md:px-12 py-6"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_30px_var(--primary-glow)] transition-transform group-hover:scale-110">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic uppercase md:text-2xl">
              Stream<span className="text-primary">Vault</span>
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="glass rounded-full px-6 py-2.5 text-sm font-bold transition-all hover:bg-white/10 hover:shadow-[0_0_20px_var(--primary-glow)]"
          >
            Sign In
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <main className="relative flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background z-10" />
          <Image
            src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2066&auto=format&fit=crop"
            fill
            priority
            className="h-full w-full object-cover opacity-40"
            alt="Cinematic Background"
          />
        </div>

        <div className="relative z-20 mx-auto max-w-5xl text-center">
          <motion.div
            {...fadeUp(0.1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Now streaming in 4K HDR
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="text-5xl font-black leading-[0.95] tracking-tighter uppercase italic md:text-8xl lg:text-9xl"
          >
            Unlimited Movies,
            <br />
            <span className="text-gradient">Zero Limits.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.35)}
            className="mx-auto mt-8 max-w-2xl text-lg font-medium text-zinc-400 md:text-2xl"
          >
            Stream the latest blockbusters and exclusive originals anywhere, anytime.
            Your cinematic vault awaits.
          </motion.p>

          <motion.div
            {...fadeUp(0.5)}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/auth/register"
              className="shimmer-btn group relative w-full overflow-hidden rounded-2xl px-12 py-4 text-xl font-black uppercase italic tracking-tighter text-white shadow-[0_0_40px_var(--primary-glow)] transition-transform hover:scale-105 sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="h-5 w-5 fill-current" />
                Start Free Trial
              </span>
            </Link>
            <Link
              href="/browse"
              className="glass w-full rounded-2xl px-12 py-4 text-xl font-bold text-zinc-300 transition-all hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Browse Catalog
            </Link>
          </motion.div>

          <motion.p {...fadeUp(0.65)} className="mt-6 text-sm text-zinc-500">
            No credit card required · Cancel anytime
          </motion.p>
        </div>
      </main>

      {/* Marquee */}
      <div className="relative z-20 border-y border-white/5 bg-surface/50 py-4 backdrop-blur-sm">
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="mx-8 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="relative z-20 px-4 py-28 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass group rounded-3xl p-10 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(124,58,237,0.15)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 transition-colors group-hover:bg-primary/30">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text-zinc-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-20 px-4 pb-28 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface to-surface p-12 text-center md:p-20"
        >
          <h2 className="text-3xl font-black uppercase italic tracking-tighter md:text-5xl">
            Ready to enter the vault?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Join millions of viewers streaming the world&apos;s best entertainment.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-block rounded-2xl bg-primary px-10 py-4 font-black uppercase italic tracking-tighter shadow-[0_0_30px_var(--primary-glow)] transition-transform hover:scale-105"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 px-4 py-12 text-sm text-zinc-500 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2 opacity-50">
            <div className="rounded bg-white p-1">
              <Play className="h-3 w-3 fill-black text-black" />
            </div>
            <span className="font-black uppercase italic tracking-tighter">StreamVault</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="transition-colors hover:text-white">Privacy</a>
            <a href="#" className="transition-colors hover:text-white">Terms</a>
            <a href="#" className="transition-colors hover:text-white">Help</a>
          </div>
          <p>© 2026 StreamVault Inc.</p>
        </div>
      </footer>
    </div>
  );
}
