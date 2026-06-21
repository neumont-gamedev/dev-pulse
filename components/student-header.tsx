import Link from "next/link";
import { SignOutButton } from "./sign-out-button";
import { ThemeToggle } from "./theme-toggle";

type StudentHeaderProps = {
  activePage?: "devlog" | "account";
};

export function StudentHeader({ activePage }: StudentHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="focus-ring rounded-md text-lg font-semibold tracking-wide text-ink dark:text-white" href="/">
          DEV PULSE
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <ThemeToggle compact />
          <Link
            aria-current={activePage === "account" ? "page" : undefined}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            href="/account"
            title="Account"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="sr-only">Account</span>
          </Link>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}
