"use client";

import { useEffect, useRef } from "react";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const tabs = [{ id: "", label: "All" }, ...categories.map((c) => ({ id: c, label: c }))];

  useEffect(() => {
    const active = tabRefs.current.get(selectedCategory);
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedCategory]);

  return (
    <div className="sticky top-16 z-40 border-b border-gray-200/90 bg-gray-50/95 backdrop-blur-sm lg:hidden">
      <div
        ref={scrollRef}
        className="shop-category-tabs container mx-auto flex gap-2 overflow-x-auto px-4 py-3"
        role="tablist"
        aria-label="Product categories"
      >
        {tabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id || "all"}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(tab.id)}
              className={[
                "shrink-0 snap-start rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-[#0B2A4A] text-white shadow-sm"
                  : "bg-white text-[#0B2A4A] ring-1 ring-gray-200/90 hover:bg-gray-50",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
