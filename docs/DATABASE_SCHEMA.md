# Dev Pulse Database Sketch

This MVP is scaffolded with mock data first. When Supabase is connected, start with these tables and keep AI-generated text separate from student-authored entries.

## Tables

### profiles
- id uuid primary key, references auth.users
- display_name text not null
- email text not null
- role text check role in ('student', 'instructor')

### courses
- id uuid primary key
- name text not null
- section text not null
- term text not null
- start_date date not null
- instructor_id uuid references profiles
- join_policy text not null default 'Invite Code'
- is_active boolean not null default true

### course_enrollments
- course_id uuid references courses
- student_id uuid references profiles
- enrolled_at timestamptz not null default now()
- primary key (course_id, student_id)

### projects
- id uuid primary key
- course_id uuid references courses
- name text not null
- description text not null
- platform text not null
- tech_stack text not null
- github_url text not null
- build_url text
- invite_code text not null unique
- health text not null
- current_milestone text not null
- created_by uuid references profiles

### project_members
- project_id uuid references projects
- profile_id uuid references profiles
- role text not null default 'Member'
- joined_at timestamptz not null default now()
- primary key (project_id, profile_id)

### course_milestones
- id uuid primary key
- course_id uuid references courses
- name text not null
- description text not null
- due_date date not null
- required_evidence text[] not null default '{}'
- sort_order integer not null default 0

### devlog_entries
- id uuid primary key
- project_id uuid references projects
- author_id uuid references profiles
- hours_worked numeric not null
- category text not null
- work_completed text not null
- problems_encountered text
- blockers text
- next_steps text
- evidence_url text
- created_at timestamptz not null default now()

### ai_summaries
- id uuid primary key
- devlog_entry_id uuid references devlog_entries
- summary text not null
- model text
- created_at timestamptz not null default now()

### milestones
- id uuid primary key
- project_id uuid references projects
- course_milestone_id uuid references course_milestones
- name text not null
- due_date date not null
- status text not null
- submission_url text
- instructor_feedback text

### review_requests
- id uuid primary key
- project_id uuid references projects
- milestone_id uuid references milestones
- requested_by uuid references profiles
- notes text
- status text not null
- requested_at timestamptz not null default now()

## Access Rules

- Instructors create courses and manage `course_enrollments`.
- Instructors define `course_milestones` for each course.
- Project `milestones` track each project's status against the instructor-defined course milestones.
- Students can only see courses where they have a `course_enrollments` row.
- Students can only see/edit projects where they have a `project_members` row.
- Invite codes should only add a student to a project if the student is already enrolled in that project's course.
- Invite codes should not enroll students into courses.
