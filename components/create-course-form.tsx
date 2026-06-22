"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createCourse, type CourseActionState } from "@/app/instructor/actions";

const initialState: CourseActionState = {
  message: "",
  status: "idle"
};

const themes = [
  { label: "Ocean", value: "blue", swatch: "bg-gradient-to-br from-sky-700 to-slate-800" },
  { label: "Emerald", value: "green", swatch: "bg-gradient-to-br from-emerald-700 to-slate-800" },
  { label: "Graphite", value: "slate", swatch: "bg-gradient-to-br from-slate-700 to-zinc-800" },
  { label: "Violet", value: "purple", swatch: "bg-gradient-to-br from-violet-700 to-slate-900" },
  { label: "Gold", value: "gold", swatch: "bg-gradient-to-br from-amber-600 to-stone-900" },
  { label: "Rose", value: "rose", swatch: "bg-gradient-to-br from-rose-700 to-slate-900" }
];

export function CreateCourseForm() {
  const [state, formAction] = useFormState(createCourse, initialState);

  return (
    <form action={formAction} className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-ink dark:text-white">Add Project</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project name
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="name" placeholder="Game Engine Projects" required />
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Course
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 uppercase text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="code" placeholder="PRO385" required />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Quarter
        <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="term" placeholder="2026 Q3 Summer" required />
      </label>
      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Short description
        <textarea className="focus-ring mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="description" placeholder="Senior game engine project tracking and milestone reviews." required />
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Start date
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="startDate" required type="date" />
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          End date
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="endDate" required type="date" />
        </label>
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Project theme</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {themes.map((theme) => (
            <label key={theme.value} className="focus-within:ring-pulse flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 p-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200">
              <input className="h-4 w-4" defaultChecked={theme.value === "blue"} name="themeGradient" type="radio" value={theme.value} />
              <span className={`h-6 w-8 rounded ${theme.swatch}`} />
              {theme.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Card image URL
        <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" name="imageUrl" placeholder="https://..." type="url" />
      </label>
      {state.message ? (
        <p className={`mt-3 rounded-md p-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200" : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-200"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="focus-ring mt-5 w-full rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">
      {pending ? "Creating Project..." : "Create Project"}
    </button>
  );
}
