import Link from "next/link";
import type { Course } from "@/lib/types";

type CourseCardProps = {
  course: Course;
  href: string;
};

const accentStyles = {
  blue: "from-sky-700 to-slate-800 text-sky-100",
  green: "from-emerald-700 to-slate-800 text-emerald-100",
  slate: "from-slate-700 to-zinc-800 text-slate-100"
};

export function CourseCard({ course, href }: CourseCardProps) {
  return (
    <Link className="focus-ring group block overflow-hidden rounded-md border border-gray-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900" href={href}>
      <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${accentStyles[course.accent]} p-5`}>
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-3xl font-bold text-white ring-1 ring-white/20">
            {course.code.slice(0, 2)}
          </div>
          <p className="mt-3 text-sm font-bold tracking-wide text-white/80">{course.imageLabel}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="truncate text-lg font-semibold text-gray-700 dark:text-gray-200">{course.name}</p>
        <p className="mt-2 text-2xl font-medium text-ink dark:text-white">{course.code}</p>
        <p className="mt-1 text-base text-gray-700 dark:text-gray-300">{course.term}</p>
      </div>
    </Link>
  );
}
