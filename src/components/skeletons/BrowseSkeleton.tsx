import ContentRowSkeleton from "./ContentRowSkeleton";

export default function BrowseSkeleton() {
  return (
    <div className="relative min-h-screen bg-surface mesh-bg">
      <nav className="fixed top-0 z-50 h-16 w-full bg-surface/80 backdrop-blur-xl" />

      {/* Hero skeleton */}
      <div className="relative h-[90vh] w-full">
        <div className="skeleton absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute bottom-28 left-4 space-y-4 md:left-12 md:bottom-32">
          <div className="skeleton h-5 w-24 rounded" />
          <div className="skeleton h-14 w-72 rounded-lg md:h-20 md:w-96" />
          <div className="skeleton h-4 w-64 rounded md:w-80" />
          <div className="skeleton h-4 w-56 rounded md:w-72" />
          <div className="flex gap-3 pt-2">
            <div className="skeleton h-11 w-28 rounded-md" />
            <div className="skeleton h-11 w-32 rounded-md" />
          </div>
        </div>
      </div>

      <div className="relative z-30 -mt-24 space-y-10 px-4 pb-24 md:-mt-32 md:space-y-14 md:px-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <ContentRowSkeleton key={i} count={7} />
        ))}
      </div>
    </div>
  );
}
