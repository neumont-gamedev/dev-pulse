"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  addCourseMilestone,
  deleteCourseMilestone,
  updateCourseMilestone,
  type CourseMilestoneActionState
} from "@/app/instructor/courses/[courseId]/actions";
import type { CourseMilestone } from "@/lib/types";

type InstructorMilestoneManagerProps = {
  courseId: string;
  courseName: string;
  milestones: CourseMilestone[];
};

const initialActionState: CourseMilestoneActionState = {
  message: "",
  status: "idle"
};

export function InstructorMilestoneManager({ courseId, courseName, milestones }: InstructorMilestoneManagerProps) {
  const orderedMilestones = useMemo(() => [...milestones].sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [milestones]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(orderedMilestones[0]?.id);
  const selectedMilestone = orderedMilestones.find((milestone) => milestone.id === selectedMilestoneId);
  const [addState, addAction] = useFormState(addCourseMilestone, initialActionState);
  const [editState, editAction] = useFormState(updateCourseMilestone, initialActionState);

  return (
    <>
      <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-ink dark:text-white">Project Milestones</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Milestones defined here apply to projects in {courseName}.</p>
        </div>

        <div className="mt-4 space-y-3">
          {orderedMilestones.map((milestone) => (
            <article key={milestone.id} className="rounded-md border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.name}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                </div>
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:ring-blue-900">Due {milestone.dueDate}</span>
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
                <form action={deleteCourseMilestone}>
                  <input name="courseId" type="hidden" value={courseId} />
                  <input name="milestoneId" type="hidden" value={milestone.id} />
                  <button className="focus-ring rounded-md border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950" type="submit">
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
          {orderedMilestones.length === 0 ? <p className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">No milestones have been added yet.</p> : null}
        </div>

        {selectedMilestone ? (
          <form action={editAction} key={selectedMilestone.id} className="mt-5 rounded-md border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-lg font-semibold text-ink dark:text-white">Edit Milestone</h3>
            <input name="courseId" type="hidden" value={courseId} />
            <input name="milestoneId" type="hidden" value={selectedMilestone.id} />
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Milestone name
              <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.name} name="name" required />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due date
              <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.dueDate} name="dueDate" required type="date" />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
              <textarea className="focus-ring mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.description} name="description" required />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Required evidence
              <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" defaultValue={selectedMilestone.requiredEvidence.join(", ")} name="requiredEvidence" />
            </label>
            <FormMessage state={editState} />
            <SubmitButton label="Save Changes" pendingLabel="Saving..." />
          </form>
        ) : null}
      </div>

      <form action={addAction} className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-ink dark:text-white">Add Milestone</h2>
        <input name="courseId" type="hidden" value={courseId} />
        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project
          <input className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300" readOnly value={courseName} />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Milestone name
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="name" placeholder="Playtest Ready" required />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Due date
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="dueDate" required type="date" />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
          <textarea className="focus-ring mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="description" placeholder="What should teams complete for this milestone?" required />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Required evidence
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="requiredEvidence" placeholder="Build link, video demo, notes" />
        </label>
        <FormMessage state={addState} />
        <SubmitButton label="Add Milestone" pendingLabel="Adding..." />
      </form>
    </>
  );
}

function FormMessage({ state }: { state: CourseMilestoneActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p className={`mt-3 rounded-md p-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200" : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-200"}`}>
      {state.message}
    </p>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="focus-ring mt-4 rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">
      {pending ? pendingLabel : label}
    </button>
  );
}
