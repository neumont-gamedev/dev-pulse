"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addStudentToCourse, type StudentEnrollmentActionState } from "@/app/instructor/courses/[courseId]/actions";

type AddStudentFormProps = {
  courseCode: string;
  courseId: string;
  unassignedStudentCount: number;
};

const initialState: StudentEnrollmentActionState = {
  message: "",
  status: "idle"
};

export function AddStudentForm({ courseCode, courseId, unassignedStudentCount }: AddStudentFormProps) {
  const [state, formAction] = useFormState(addStudentToCourse, initialState);

  return (
    <form action={formAction} className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-ink dark:text-white">Add Student To Project {courseCode}</h2>
      <input name="courseId" type="hidden" value={courseId} />
      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Student name
        <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="displayName" placeholder="Ari Chen" />
      </label>
      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Student email
        <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="email" placeholder="student@school.edu" required type="email" />
      </label>
      <SubmitButton />
      {state.message ? (
        <p className={`mt-3 rounded-md p-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200" : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-200"}`}>
          {state.message}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
        If the student does not have an account yet, Dev Pulse creates one with the temporary password DevPulse123!.
      </p>
      <div className="mt-5 rounded-md bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        {unassignedStudentCount} enrolled student{unassignedStudentCount === 1 ? "" : "s"} are not assigned to a project yet.
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="focus-ring mt-4 w-full rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">
      {pending ? "Adding Student..." : "Add Student"}
    </button>
  );
}
