import Link from "next/link";
import { notFound } from "next/navigation";
import { DevlogForm } from "@/components/devlog-form";
import { MilestoneTimeline } from "@/components/milestone-timeline";
import { StatusBadge } from "@/components/status-badge";
import { StudentHeader } from "@/components/student-header";
import { requireRole } from "@/lib/current-user";
import {
  getCourseFromFirestore,
  getProjectDevlogsFromFirestore,
  getProjectHours,
  getProjectMilestonesFromFirestore,
  getStudentProjectsFromFirestore
} from "@/lib/firestore-data";

export const dynamic = "force-dynamic";

type CoursePageProps = {
  params: {
    courseId: string;
  };
};

export default async function CoursePage({ params }: CoursePageProps) {
  const student = await requireRole("student");
  const course = await getCourseFromFirestore(params.courseId);

  if (!course) {
    notFound();
  }

  const studentProject = (await getStudentProjectsFromFirestore(student.id, course.id))[0];
  const studentMilestones = studentProject ? await getProjectMilestonesFromFirestore(studentProject.id) : [];
  const studentEntries = studentProject ? await getProjectDevlogsFromFirestore(studentProject.id) : [];
  const totalHours = getProjectHours(studentEntries);

  return (
    <main className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <StudentHeader activePage="devlog" />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link className="focus-ring inline-flex rounded-md text-sm font-medium text-pulse hover:underline" href="/">
          Back to courses
        </Link>

        {studentProject ? (
          <>
            <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{course.code} - {course.term}</p>
                <h1 className="mt-1 text-2xl font-semibold text-ink dark:text-white">Dev Log</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{studentProject.name}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={studentProject.health} />
                <span className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                  {totalHours.toFixed(1)} hours logged
                </span>
              </div>
            </section>

            <section id="milestones">
              <h2 className="text-lg font-semibold text-ink dark:text-white">Milestones</h2>
              <MilestoneTimeline courseStartDate={course.startDate} milestones={studentMilestones} />
            </section>

            <section id="devlog">
              <DevlogForm />
            </section>

            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-ink dark:text-white">Recent Entries</h2>
              <div className="mt-4 space-y-3">
                {studentEntries.map((entry) => (
                  <article key={entry.id} className="rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{entry.date}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{entry.category} - {entry.hoursWorked} hours</p>
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{entry.author}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{entry.workCompleted}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h1 className="text-2xl font-semibold text-ink dark:text-white">Join a project or create a new one</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Your dev log for {course.name} will appear here once you are part of a project.
            </p>
            <Link className="focus-ring mt-5 inline-flex rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white" href="/account">
              Go To Account
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
