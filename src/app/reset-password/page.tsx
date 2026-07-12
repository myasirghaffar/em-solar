"use client";

import { Suspense } from "react";
import ResetPassword from "@/features/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF7A00] border-t-transparent" />
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}
