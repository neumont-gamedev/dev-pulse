# Dev Pulse - Codex Instructions

## Project Overview
Dev Pulse is a course project-tracking app for senior game engine students. Students create accounts, register projects, add GitHub repo links, create devlog entries, log hours worked, track milestones, and request instructor check-ins.

## Primary Users
- Students: create projects, submit progress entries, log hours, mark milestones ready for review.
- Instructor: view all projects, see recent activity, review milestone check-ins, identify inactive or blocked teams.

## MVP Features
1. Authentication
2. Student project creation
3. Devlog entries
4. Hours worked per entry
5. Milestones with statuses:
   - Not Started
   - In Progress
   - Ready for Review
   - Approved
   - Needs Revision
6. Instructor dashboard
7. Basic AI summary generation, server-side only

## Important Rules
- Never expose API keys in frontend code.
- Keep AI calls on the backend.
- Store both raw student entries and AI-generated summaries.
- Do not let AI replace student reflection; AI should summarize or organize what the student wrote.
- Build in small, testable steps.
- Prefer clear, simple code over clever abstractions.

## Suggested Stack
- Next.js
- TypeScript
- Supabase for auth/database
- OpenAI API for AI summaries
- Tailwind for UI

## Development Approach
Start with the MVP. Do not add GitHub OAuth, contribution graphs, or advanced analytics until the core student/instructor workflow works.
