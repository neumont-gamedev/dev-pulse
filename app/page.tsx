import { CourseCard } from "@/components/course-card";
import { StudentHeader } from "@/components/student-header";
import { requireRole } from "@/lib/current-user";
import { getEnrolledCoursesFromFirestore } from "@/lib/firestore-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const student = await requireRole("student");
  const enrolledCourses = await getEnrolledCoursesFromFirestore(student.id);

  return (
    <main className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <StudentHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <h1 className="text-2xl font-semibold text-ink dark:text-white">Courses</h1>
        </section>

        <section className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} href={`/courses/${course.id}`} />
          ))}
        </section>
      </div>
    </main>
  );
}
