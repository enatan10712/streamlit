"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#0d0c1d] flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Something went wrong!</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        We apologize for the inconvenience. Our team has been notified and is working on a fix.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
