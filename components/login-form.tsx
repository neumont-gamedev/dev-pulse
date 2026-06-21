"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import type { Profile } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
      });
      const payload = (await response.json()) as { profile?: Profile; message?: string };

      if (!response.ok || !payload.profile) {
        throw new Error(payload.message ?? "Unable to start your Dev Pulse session.");
      }

      router.push(callbackUrl ?? (payload.profile.role === "instructor" ? "/instructor" : "/"));
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900" onSubmit={handleSubmit}>
      <div>
        <h1 className="text-2xl font-semibold text-ink dark:text-white">Sign in</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Use your Dev Pulse account to continue.</p>
      </div>

      <label className="mt-5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Email
        <input
          autoComplete="email"
          className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Password
        <input
          autoComplete="current-password"
          className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>

      {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}

      <button className="focus-ring mt-5 w-full rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
