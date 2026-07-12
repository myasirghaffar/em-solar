"use client";

import AuthGate from "@/components/AuthGate";
import CustomerAccount from "@/features/website/CustomerAccount";

export default function ProfilePage() {
  return (
    <AuthGate>
      <CustomerAccount />
    </AuthGate>
  );
}
