"use client";

import { Suspense } from "react";
import VerifyEmail from "@/features/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF7A00] border-t-transparent" />
        </div>
      }
    >
      <VerifyEmail />
    </Suspense>
  );
}
