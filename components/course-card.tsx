import Link from "next/link";
import type { Course } from "@/lib/types";

type CourseCardProps = {
  course: Course;
  href: string;
};

const accentStyles = {
  blue: "from-sky-700 to-slate-800 text-sky-100",
  green: "from-emerald-700 to-slate-800 text-emerald-100",
  slate: "from-slate-700 to-zinc-800 text-slate-100",
  purple: "from-violet-700 to-slate-900 text-violet-100",
  gold: "from-amber-600 to-stone-900 text-amber-100",
  rose: "from-rose-700 to-slate-900 text-rose-100"
};

export function CourseCard({ course, href }: CourseCardProps) {
  const theme = course.themeGradient ?? course.accent;

  return (
    <Link className="focus-ring group block overflow-hidden rounded-md border border-gray-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900" href={href}>
      <div
        className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${accentStyles[theme]} p-5`}
        style={course.imageUrl ? { backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.45), rgba(17, 24, 39, 0.62)), url(${course.imageUrl})`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}
      >
        <div className="relative text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold text-white ring-1 ring-white/30 backdrop-blur-sm">
            {course.code.slice(0, 2)}
          </div>
          <p className="mt-3 text-sm font-bold tracking-wide text-white/80">{course.imageLabel}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-2xl font-semibold leading-tight text-ink dark:text-white">{course.name}</p>
        <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">{course.code}</p>
        <p className="mt-1 text-base text-gray-700 dark:text-gray-300">{course.term}</p>
        {course.description ? <p className="mt-3 line-clamp-2 text-sm leading-5 text-gray-600 dark:text-gray-400">{course.description}</p> : null}
        {course.startDate && course.endDate ? <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-500">{course.startDate} to {course.endDate}</p> : null}
      </div>
    </Link>
  );
}
