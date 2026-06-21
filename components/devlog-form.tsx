export function DevlogForm() {
  return (
    <form className="rounded-md border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-ink dark:text-white">Daily Standup Entry</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Answer the standup questions for your project work today.</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Hours worked since last standup
          <input className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" min="0" step="0.25" type="number" placeholder="2.5" />
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Primary work area
          <select className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
            <option>Programming</option>
            <option>Design</option>
            <option>Art</option>
            <option>Audio</option>
            <option>Research</option>
            <option>Testing</option>
            <option>Documentation</option>
            <option>Team Meeting</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current status
          <select className="focus-ring mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
            <option>On Track</option>
            <option>Needs Help</option>
            <option>Blocked</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
        What did you complete since the last standup?
        <textarea className="focus-ring mt-1 min-h-24 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="Describe completed work, commits, assets, tests, builds, or decisions." />
      </label>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What are you working on next?
          <textarea className="focus-ring mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="List the next tasks you plan to tackle before the next standup." />
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What is blocking you?
          <textarea className="focus-ring mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" placeholder="Write none if you are not blocked. Include help needed, unclear requirements, bugs, or missing assets." />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">AI may summarize this later, but the standup answers stay student-authored.</p>
        <button className="focus-ring rounded-md bg-pulse px-4 py-2 text-sm font-semibold text-white" type="button">
          Save Standup
        </button>
      </div>
    </form>
  );
}
