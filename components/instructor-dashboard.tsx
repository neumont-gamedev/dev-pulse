import { devlogEntries, milestones, projects, reviewRequests } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";

export function InstructorDashboard() {
  const readyCount = milestones.filter((milestone) => milestone.status === "Ready for Review").length;
  const atRiskCount = projects.filter((project) => project.health === "At Risk" || project.health === "Behind Schedule").length;

  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-ink dark:text-white">Instructor Dashboard</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Review milestone requests, recent activity, and projects that may need support.</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</p>
          <p className="mt-1 text-2xl font-semibold text-ink dark:text-white">{projects.length}</p>
        </div>
        <div className="rounded-md bg-teal-50 p-4">
          <p className="text-sm font-medium text-teal-700">Ready Reviews</p>
          <p className="mt-1 text-2xl font-semibold text-teal-900">{readyCount}</p>
        </div>
        <div className="rounded-md bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-700">Needs Attention</p>
          <p className="mt-1 text-2xl font-semibold text-amber-900">{atRiskCount}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {reviewRequests.map((request) => {
          const project = projects.find((item) => item.id === request.projectId);
          const milestone = milestones.find((item) => item.id === request.milestoneId);
          const entry = devlogEntries.find((item) => item.projectId === request.projectId);

          return (
            <article key={request.id} className="rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{project?.name}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{milestone?.name}</p>
                </div>
                <StatusBadge status={request.status} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Last Activity</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">{project?.lastUpdated}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Blockers</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">{entry?.blockers}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
