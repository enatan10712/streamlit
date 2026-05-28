"use client";

import { useModalStore } from "@/store/useModalStore";
import ContentCard from "./ContentCard";

export default function ContentRow({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2 group cursor-pointer">
        {title}
        <span className="text-xs text-[#7c3aed] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          Explore All
        </span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>
    </div>
  );
}
