"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut(firebaseAuth);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className="focus-ring rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      onClick={handleSignOut}
      type="button"
    >
      Sign Out
    </button>
  );
}
