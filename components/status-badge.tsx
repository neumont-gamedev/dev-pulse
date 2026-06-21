import type { MilestoneStatus, ProjectHealth } from "@/lib/types";

type StatusBadgeProps = {
  status: MilestoneStatus | ProjectHealth | "Pending" | "Approved" | "Needs Revision";
};

const statusStyles: Record<string, string> = {
  Active: "bg-blue-50 text-blue-700 ring-blue-200",
  "At Risk": "bg-amber-50 text-amber-800 ring-amber-200",
  "Behind Schedule": "bg-red-50 text-red-700 ring-red-200",
  "On Track": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Ready for Review": "bg-teal-50 text-teal-700 ring-teal-200",
  "Not Started": "bg-gray-100 text-gray-700 ring-gray-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Needs Revision": "bg-orange-50 text-orange-800 ring-orange-200",
  Pending: "bg-violet-50 text-violet-700 ring-violet-200"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-md px-2.5 text-xs font-semibold ring-1 ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
