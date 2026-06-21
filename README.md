# Dev Pulse

Dev Pulse is a course project-tracking app for long-term software, game development, and capstone projects. Students log development progress, hours, blockers, and milestone readiness while instructors review project health and give feedback between formal check-ins.

## MVP Scope

- Authentication-ready Next.js structure
- Student project dashboard
- Devlog entry form
- Hours and milestone tracking
- Instructor dashboard and review queue
- Server-only AI summary route
- Supabase-ready domain model

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Copy `.env.example` to `.env.local` when connecting Supabase or OpenAI. Keep `OPENAI_API_KEY` server-side only.

## Project Notes

- Student-authored devlog text and AI-generated summaries should be stored separately.
- AI should summarize or organize student reflection, not replace it.
- GitHub OAuth, contribution graphs, advanced analytics, and notifications are future features after the core workflow is working.
