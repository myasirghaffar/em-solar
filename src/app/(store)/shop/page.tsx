"use client";

import { Suspense } from "react";
import Shop from "@/features/website/Shop";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF7A00] border-t-transparent" />
        </div>
      }
    >
      <Shop />
    </Suspense>
  );
}
