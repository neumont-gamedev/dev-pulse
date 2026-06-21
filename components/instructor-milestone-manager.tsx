"use client";

import { useMemo, useState } from "react";
import type { CourseMilestone } from "@/lib/types";

type InstructorMilestoneManagerProps = {
  courseName: string;
  milestones: CourseMilestone[];
};

export function InstructorMilestoneManager({ courseName, milestones }: InstructorMilestoneManagerProps) {
  const orderedMilestones = useMemo(() => [...milestones].sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [milestones]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(orderedMilestones[0]?.id);
  const selectedMilestone = orderedMilestones.find((milestone) => milestone.id === selectedMilestoneId);

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-ink dark:text-white">Course Milestones</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">New milestones will be created for {courseName}.</p>
      </div>

      <div className="mt-4 space-y-3">
        {orderedMilestones.map((milestone) => (
          <article key={milestone.id} className="rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
              </div>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">Due {milestone.dueDate}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {milestone.requiredEvidence.map((item) => (
                <span key={item} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="focus-ring rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" type="button" onClick={() => setSelectedMilestoneId(milestone.id)}>
                Edit
              </button>
              <button className="focus-ring rounded-md border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950" type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedMilestone ? (
        <form className="mt-5 rounded-md border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-ink dark:text-white">Edit Milestone</h3>
          <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Milestone name
            <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.name} />
          </label>
          <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Due date
            <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.dueDate} type="date" />
          </label>
          <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
            <textarea className="focus-ring mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.description} />
          </label>
          <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Required evidence
            <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.requiredEvidence.join(", ")} />
          </label>
          <button className="focus-ring mt-4 rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white" type="button">
            Save Changes
          </button>
        </form>
      ) : null}
    </div>
  );
}
