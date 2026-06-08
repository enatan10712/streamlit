"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 mesh-bg text-center">
      <div className="glass flex h-20 w-20 items-center justify-center rounded-3xl">
        <AlertTriangle className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Something went wrong
        </h1>
        <p className="max-w-md text-zinc-400">
          We hit a snag loading this page. Try again or head back home.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold transition-transform hover:scale-105"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="glass rounded-xl px-6 py-3 font-bold transition-colors hover:bg-white/10"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
