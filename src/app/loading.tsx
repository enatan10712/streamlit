export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background mesh-bg">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <div className="absolute inset-0 h-16 w-16 animate-pulse-glow rounded-full bg-primary/20 blur-xl" />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">
        Loading vault
      </p>
    </div>
  );
}
