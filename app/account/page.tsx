import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { StatusBadge } from "@/components/status-badge";
import { StudentHeader } from "@/components/student-header";
import { requireRole } from "@/lib/current-user";
import {
  getEnrolledCoursesFromFirestore,
  getJoinableProjectsFromFirestore,
  getProfilesByIdsFromFirestore,
  getProjectDevlogsFromFirestore,
  getProjectMilestonesFromFirestore,
  getStudentProjectsFromFirestore
} from "@/lib/firestore-data";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const student = await requireRole("student");
  const enrolledCourses = await getEnrolledCoursesFromFirestore(student.id);
  const activeCourse = enrolledCourses[0];
  const studentProjects = activeCourse ? await getStudentProjectsFromFirestore(student.id, activeCourse.id) : [];
  const studentProject = studentProjects[0];
  const joinableProjects = activeCourse ? await getJoinableProjectsFromFirestore(student.id, activeCourse.id) : [];
  const [studentProjectMilestones, studentProjectEntries, studentProjectMembers] = studentProject
    ? await Promise.all([
        getProjectMilestonesFromFirestore(studentProject.id),
        getProjectDevlogsFromFirestore(studentProject.id),
        getProfilesByIdsFromFirestore(studentProject.teamMemberIds)
      ])
    : [[], [], []];

  return (
    <main className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <StudentHeader activePage="account" />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-ink dark:text-white">Account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{student?.displayName} - {student?.email}</p>
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-ink dark:text-white">Courses</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your instructor adds you to courses. Invite codes only join projects inside these courses.</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {enrolledCourses.map((course) => (
              <article key={course.id} className={`rounded-md border p-4 ${course.id === activeCourse.id ? "border-pulse bg-blue-50 dark:bg-blue-950/30" : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {course.code} - {course.section} - {course.term}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={course.id === activeCourse.id ? "Active" : "On Track"} />
                    <Link className="focus-ring text-sm font-medium text-pulse hover:underline" href={`/courses/${course.id}`}>
                      Open course
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
            <h2 className="text-xl font-semibold text-ink dark:text-white">Project{activeCourse ? ` In ${activeCourse.name}` : ""}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Students only see and edit projects where they are members.</p>
            </div>
            <StatusBadge status={studentProject?.health ?? "Not Started"} />
          </div>
          {studentProject ? (
            <ProjectCard
              project={studentProject}
              milestones={studentProjectMilestones}
              recentEntries={studentProjectEntries}
              teamMembers={studentProjectMembers.map((member) => member.displayName)}
            />
          ) : (
            <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              Join a project or create a new one.
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-ink dark:text-white">Joinable Projects</h2>
            <div className="mt-4 space-y-3">
              {joinableProjects.map((project) => (
                <div key={project.id} className="rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{project.name}</p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                    </div>
                    <StatusBadge status={project.health} />
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Invite code required from a teammate.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <form className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-ink dark:text-white">Join With Invite Code</h2>
              <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project invite code
                <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 uppercase text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="EMBER-27" />
              </label>
              <button className="focus-ring mt-4 w-full rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white" type="button">
                Join Project
              </button>
            </form>

            <form className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-ink dark:text-white">Create Project</h2>
              <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project name
                <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="Project title" />
              </label>
              <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub repository
                <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="https://github.com/team/project" />
              </label>
              <button className="focus-ring mt-4 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-800" type="button">
                Create Project
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
