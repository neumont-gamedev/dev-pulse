import { CourseCard } from "@/components/course-card";
import { CreateCourseForm } from "@/components/create-course-form";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireRole } from "@/lib/current-user";
import { getInstructorCoursesFromFirestore } from "@/lib/firestore-data";
import { deleteCourse } from "./actions";

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

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <h1 className="text-2xl font-semibold text-ink dark:text-white">Courses</h1>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-8 md:grid-cols-2">
            {courses.map((course) => (
              <article key={course.id} className="space-y-3">
                <CourseCard course={course} href={`/instructor/courses/${course.id}`} />
                <form action={deleteCourse} className="flex justify-end">
                  <input name="courseId" type="hidden" value={course.id} />
                  <button className="focus-ring rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-gray-900 dark:text-red-300 dark:hover:bg-red-950" type="submit">
                    Delete Course
                  </button>
                </form>
              </article>
            ))}
            {courses.length === 0 ? <p className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">No courses have been created yet.</p> : null}
          </div>
          <CreateCourseForm />
        </section>
      </div>
    </main>
  );
}
