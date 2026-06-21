import type { DevlogEntry, Milestone, Project } from "@/lib/types";
import { StatusBadge } from "./status-badge";

type ProjectCardProps = {
  project: Project;
  milestones?: Milestone[];
  recentEntries?: DevlogEntry[];
  teamMembers?: string[];
};

export function ProjectCard({ project, milestones = [], recentEntries = [], teamMembers = [] }: ProjectCardProps) {
  const recentEntry = recentEntries[0];
  const hours = recentEntries.reduce((total, entry) => total + entry.hoursWorked, 0);

  return (
    <article className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink dark:text-white">{project.name}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">{project.description}</p>
        </div>
        <StatusBadge status={project.health} />
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-medium text-gray-500 dark:text-gray-400">Team</p>
          <p className="mt-1 text-gray-900 dark:text-gray-100">{teamMembers.length ? teamMembers.join(", ") : "No members yet"}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500 dark:text-gray-400">Stack</p>
          <p className="mt-1 text-gray-900 dark:text-gray-100">{project.techStack}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500 dark:text-gray-400">Hours Logged</p>
          <p className="mt-1 text-gray-900 dark:text-gray-100">{hours.toFixed(1)}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500 dark:text-gray-400">Last Update</p>
          <p className="mt-1 text-gray-900 dark:text-gray-100">{project.lastUpdated}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current milestone</p>
            <p className="mt-1 font-semibold text-ink dark:text-white">{project.currentMilestone}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {milestones.map((milestone) => (
              <StatusBadge key={milestone.id} status={milestone.status} />
            ))}
          </div>
        </div>

        {recentEntry ? (
          <div className="mt-4 rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Latest devlog by {recentEntry.author}</p>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{recentEntry.workCompleted}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
