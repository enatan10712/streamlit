import ContentCardSkeleton from "./ContentCardSkeleton";

export default function ContentRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      <div className="skeleton h-7 w-48 rounded-lg" />
      <div className="flex gap-3 md:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-[42vw] shrink-0 sm:w-[28vw] md:w-[20vw] lg:w-[15vw] xl:w-[12vw]"
          >
            <ContentCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
