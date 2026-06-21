"use client";

import { useMemo, useState } from "react";
import type { Milestone } from "@/lib/types";

type MilestoneTimelineProps = {
  milestones: Milestone[];
  courseStartDate: string;
  compact?: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const COURSE_WEEKS = 10;
const today = new Date("2026-06-21T00:00:00");

export function MilestoneTimeline({ milestones, courseStartDate, compact = false }: MilestoneTimelineProps) {
  const orderedMilestones = useMemo(() => [...milestones].sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [milestones]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(orderedMilestones[0]?.id);
  const courseStart = new Date(`${courseStartDate}T00:00:00`);
  const courseEnd = new Date(courseStart.getTime() + COURSE_WEEKS * 7 * MS_PER_DAY);
  const progressPercent = getTimelineProgressPercent(courseStart, courseEnd);
  const selectedMilestone = orderedMilestones.find((milestone) => milestone.id === selectedMilestoneId) ?? orderedMilestones[0];

  if (orderedMilestones.length === 0) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">No milestones have been defined yet.</p>;
  }

  return (
    <div>
      <div className={compact ? "py-6" : "py-8"}>
        <div className="relative h-24">
          <div className="absolute left-4 right-4 top-8 h-1 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="absolute left-4 top-8 h-1 rounded-full bg-pulse transition-all dark:bg-mint" style={{ width: `calc((100% - 2rem) * ${progressPercent / 100})` }} />

          {Array.from({ length: COURSE_WEEKS }).map((_, index) => (
            <div key={index} className="absolute top-6 flex -translate-x-1/2 flex-col items-center gap-2" style={{ left: `calc(1rem + (100% - 2rem) * ${index / (COURSE_WEEKS - 1)})` }}>
              <span className="h-5 w-0.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
          ))}

          {orderedMilestones.map((milestone) => {
            const tone = getMilestoneTone(milestone);
            const position = getMilestonePositionPercent(milestone, courseStart, courseEnd);

            return (
              <button
                key={milestone.id}
                className="group absolute top-4 flex -translate-x-1/2 flex-col items-center gap-3 text-center"
                style={{ left: `calc(1rem + (100% - 2rem) * ${position / 100})` }}
                type="button"
                onFocus={() => setSelectedMilestoneId(milestone.id)}
                onMouseEnter={() => setSelectedMilestoneId(milestone.id)}
              >
                <span className={`h-9 w-9 rounded-full border-4 border-white shadow-sm ring-2 transition group-hover:scale-110 group-focus-visible:scale-110 dark:border-gray-900 ${tone.dot}`} />
                <span className="max-w-24 truncate text-xs font-semibold text-gray-800 dark:text-gray-200">{milestone.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!compact && selectedMilestone ? <MilestoneDetail milestone={selectedMilestone} /> : null}
    </div>
  );
}

function MilestoneDetail({ milestone }: { milestone: Milestone }) {
  const tone = getMilestoneTone(milestone);

  return (
    <section className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{milestone.name}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Due {milestone.dueDate}</p>
        </div>
        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${tone.badge}`}>{tone.label}</span>
      </div>
      {milestone.instructorFeedback ? <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{milestone.instructorFeedback}</p> : null}
      <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">Click a milestone dot to change status once editing is enabled.</p>
    </section>
  );
}

function getMilestonePositionPercent(milestone: Milestone, courseStart: Date, courseEnd: Date) {
  const firstDueDate = courseStart.getTime();
  const lastDueDate = courseEnd.getTime();
  const dueDate = new Date(`${milestone.dueDate}T00:00:00`).getTime();
  const totalDuration = lastDueDate - firstDueDate;

  if (totalDuration <= 0) {
    return 50;
  }

  return Math.max(0, Math.min(100, ((dueDate - firstDueDate) / totalDuration) * 100));
}

function getTimelineProgressPercent(courseStart: Date, courseEnd: Date) {
  const firstDueDate = courseStart.getTime();
  const lastDueDate = courseEnd.getTime();
  const totalDuration = lastDueDate - firstDueDate;

  if (totalDuration <= 0) {
    return 100;
  }

  const elapsed = today.getTime() - firstDueDate;
  return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
}

function getMilestoneTone(milestone: Milestone) {
  const daysLate = Math.floor((today.getTime() - new Date(`${milestone.dueDate}T00:00:00`).getTime()) / MS_PER_DAY);

  if (milestone.status === "Approved") {
    return {
      label: "Approved",
      dot: "bg-emerald-500 ring-emerald-200",
      badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    };
  }

  if (milestone.status === "Needs Revision" || daysLate >= 7) {
    return {
      label: milestone.status === "Needs Revision" ? "Needs Revision" : "Very Late",
      dot: "bg-red-500 ring-red-200",
      badge: "bg-red-50 text-red-700 ring-1 ring-red-200"
    };
  }

  if (daysLate > 0) {
    return {
      label: "Overdue",
      dot: "bg-amber-400 ring-amber-200",
      badge: "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
    };
  }

  if (milestone.status === "Ready for Review") {
    return {
      label: "Ready for Review",
      dot: "bg-teal-500 ring-teal-200",
      badge: "bg-teal-50 text-teal-700 ring-1 ring-teal-200"
    };
  }

  if (milestone.status === "In Progress") {
    return {
      label: "In Progress",
      dot: "bg-blue-500 ring-blue-200",
      badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
    };
  }

  return {
    label: "Not Started",
    dot: "bg-gray-400 ring-gray-200",
    badge: "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
  };
}
