import Link from "next/link";
import { notFound } from "next/navigation";
import { AddStudentForm } from "@/components/add-student-form";
import { InstructorMilestoneManager } from "@/components/instructor-milestone-manager";
import { MilestoneTimeline } from "@/components/milestone-timeline";
import { MetricCard } from "@/components/metric-card";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusBadge } from "@/components/status-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireRole } from "@/lib/current-user";
import {
  getCourseFromFirestore,
  getCourseMilestonesFromFirestore,
  getCourseProjectsFromFirestore,
  getCourseStudentsFromFirestore,
  getProfilesByIdsFromFirestore,
  getProjectDevlogsFromFirestore,
  getProjectHours,
  getProjectMilestonesFromFirestore,
  getReviewRequestsFromFirestore
} from "@/lib/firestore-data";
import { removeStudentFromCourse } from "./actions";

export const dynamic = "force-dynamic";

type InstructorCoursePageProps = {
  params: {
    courseId: string;
  };
};

export default async function InstructorCoursePage({ params }: InstructorCoursePageProps) {
  await requireRole("instructor");
  const activeCourse = await getCourseFromFirestore(params.courseId);

  if (!activeCourse) {
    notFound();
  }

  const [courseStudents, courseProjects, courseMilestoneDefinitions, reviewRequests] = await Promise.all([
    getCourseStudentsFromFirestore(activeCourse.id),
    getCourseProjectsFromFirestore(activeCourse.id),
    getCourseMilestonesFromFirestore(activeCourse.id),
    getReviewRequestsFromFirestore()
  ]);
  const projectDetails = await Promise.all(
    courseProjects.map(async (project) => {
      const [projectMilestones, projectEntries, projectMembers] = await Promise.all([
        getProjectMilestonesFromFirestore(project.id),
        getProjectDevlogsFromFirestore(project.id),
        getProfilesByIdsFromFirestore(project.teamMemberIds)
      ]);

      return {
        project,
        projectEntries,
        projectMilestones,
        teamNames: projectMembers.map((member) => member.displayName)
      };
    })
  );
  const readyReviews = projectDetails.flatMap((detail) => detail.projectMilestones).filter((milestone) => milestone.status === "Ready for Review");
  const unassignedStudents = courseStudents.filter((student) => !courseProjects.some((project) => project.teamMemberIds.includes(student.id)));

  return (
    <main className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link className="focus-ring rounded-md text-sm font-medium text-pulse hover:underline" href="/instructor">
              Back to courses
            </Link>
            <h1 className="mt-2 text-3xl font-semibold text-ink dark:text-white">{activeCourse.name}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{activeCourse.code} - {activeCourse.section} - {activeCourse.term}</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <a className="focus-ring rounded-md border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800" href="#students">
              Students
            </a>
            <a className="focus-ring rounded-md border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800" href="#milestones">
              Milestones
            </a>
            <a className="focus-ring rounded-md border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800" href="#projects">
              Projects
            </a>
            <ThemeToggle />
            <SignOutButton />
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Course" value={activeCourse.code} detail="Selected course context" />
          <MetricCard label="Students" value={String(courseStudents.length)} detail="Enrolled by instructor" />
          <MetricCard label="Projects" value={String(courseProjects.length)} detail="Student-created teams" />
          <MetricCard label="Ready Reviews" value={String(readyReviews.length)} detail="Milestones awaiting feedback" />
        </section>

        <section id="milestones" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <InstructorMilestoneManager courseName={activeCourse.name} milestones={courseMilestoneDefinitions} />

          <form className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-ink dark:text-white">Add Milestone</h2>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course
              <input className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300" readOnly value={`${activeCourse.code} - ${activeCourse.name}`} />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Milestone name
              <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="Playtest Ready" />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due date
              <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" type="date" />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
              <textarea className="focus-ring mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="What should teams complete for this milestone?" />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Required evidence
              <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="Build link, video demo, notes" />
            </label>
            <button className="focus-ring mt-4 w-full rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white" type="button">
              Add Milestone To {activeCourse.code}
            </button>
          </form>
        </section>

        <section id="students" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-ink dark:text-white">Students</h2>
            <div className="mt-4 space-y-3">
              {courseStudents.map((student) => {
                const project = courseProjects.find((item) => item.teamMemberIds.includes(student.id));

                return (
                  <div key={student.id} className="grid gap-3 rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-center">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">{student.displayName}</p>
                      <p className="mt-1 break-all text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">Project</p>
                      <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{project?.name ?? "Unassigned"}</p>
                    </div>
                    <form action={removeStudentFromCourse}>
                      <input name="courseId" type="hidden" value={activeCourse.id} />
                      <input name="studentId" type="hidden" value={student.id} />
                      <button className="focus-ring rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" type="submit">
                      Remove
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>

          <AddStudentForm courseCode={activeCourse.code} courseId={activeCourse.id} unassignedStudentCount={unassignedStudents.length} />
        </section>

        <section id="projects" className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-ink dark:text-white">Project Monitoring</h2>
          <div className="mt-4 grid gap-3">
            {projectDetails.map(({ project, projectEntries, projectMilestones, teamNames }) => {
              const projectReview = reviewRequests.find((request) => request.projectId === project.id);

              return (
                <article key={project.id} className="rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{teamNames.join(", ") || "No members yet"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={project.health} />
                      <StatusBadge status={projectReview?.status ?? "Pending"} />
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">Invite Code</p>
                      <p className="mt-1 font-mono text-gray-900 dark:text-gray-100">{project.inviteCode}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">Hours</p>
                      <p className="mt-1 text-gray-900 dark:text-gray-100">{getProjectHours(projectEntries).toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">Last Update</p>
                      <p className="mt-1 text-gray-900 dark:text-gray-100">{project.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Milestones</p>
                    <div className="mt-3">
                      <MilestoneTimeline compact courseStartDate={activeCourse.startDate} milestones={projectMilestones} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
