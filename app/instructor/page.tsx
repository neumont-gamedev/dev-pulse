import { CourseCard } from "@/components/course-card";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireRole } from "@/lib/current-user";
import { getInstructorCoursesFromFirestore } from "@/lib/firestore-data";

export const dynamic = "force-dynamic";

export default async function InstructorPage() {
  const instructor = await requireRole("instructor");
  const courses = await getInstructorCoursesFromFirestore(instructor.id);

  return (
    <main className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-wide text-ink dark:text-white">DEV PULSE</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Instructor</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <h1 className="text-2xl font-semibold text-ink dark:text-white">Courses</h1>
        </section>

        <section className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} href={`/instructor/courses/${course.id}`} />
          ))}
        </section>
      </div>
    </main>
  );
}
