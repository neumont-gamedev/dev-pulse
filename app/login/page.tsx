import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUserProfile, getDefaultLandingPath } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const profile = await getCurrentUserProfile();

  if (profile) {
    redirect(getDefaultLandingPath(profile));
  }

  return (
    <main className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-lg font-semibold tracking-wide text-ink dark:text-white">DEV PULSE</p>
          <ThemeToggle compact />
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md items-center px-4 py-8">
        <Suspense fallback={<div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
