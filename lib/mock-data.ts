import type { Course, CourseEnrollment, CourseMilestone, DevlogEntry, Milestone, Profile, Project, ProjectMembership, ReviewRequest } from "./types";

export const currentStudentId = "student-ari";
export const currentInstructorId = "instructor-maple";

export const profiles: Profile[] = [
  {
    id: currentInstructorId,
    displayName: "Professor Maple",
    email: "rmaple@neumont.edu",
    role: "instructor"
  },
  {
    id: "student-ari",
    displayName: "Ari Chen",
    email: "ari.chen@student.neumont.edu",
    role: "student"
  },
  {
    id: "student-maya",
    displayName: "Maya Patel",
    email: "maya.patel@student.neumont.edu",
    role: "student"
  },
  {
    id: "student-noah",
    displayName: "Noah Kim",
    email: "noah.kim@student.neumont.edu",
    role: "student"
  },
  {
    id: "student-jules",
    displayName: "Jules Rivera",
    email: "jules.rivera@student.neumont.edu",
    role: "student"
  },
  {
    id: "student-sam",
    displayName: "Sam Brooks",
    email: "sam.brooks@student.neumont.edu",
    role: "student"
  },
  {
    id: "student-lina",
    displayName: "Lina Torres",
    email: "lina.torres@student.neumont.edu",
    role: "student"
  }
];

export const courses: Course[] = [
  {
    id: "course-engine-spring",
    name: "Senior Game Engine",
    code: "PRO385",
    section: "GE-410-A",
    term: "Spring 2026",
    startDate: "2026-05-05",
    instructorId: currentInstructorId,
    joinPolicy: "Invite Code",
    isActive: true,
    accent: "green",
    imageLabel: "GAME ENGINE PROJECTS"
  },
  {
    id: "course-capstone-summer",
    name: "Capstone Studio",
    code: "CAP490",
    section: "CAP-490-B",
    term: "Summer 2026",
    startDate: "2026-06-01",
    instructorId: currentInstructorId,
    joinPolicy: "Invite Code",
    isActive: true,
    accent: "blue",
    imageLabel: "CAPSTONE STUDIO"
  }
];

export const courseEnrollments: CourseEnrollment[] = [
  { courseId: "course-engine-spring", studentId: "student-ari", enrolledAt: "2026-05-01" },
  { courseId: "course-engine-spring", studentId: "student-maya", enrolledAt: "2026-05-01" },
  { courseId: "course-engine-spring", studentId: "student-noah", enrolledAt: "2026-05-01" },
  { courseId: "course-engine-spring", studentId: "student-jules", enrolledAt: "2026-05-03" },
  { courseId: "course-engine-spring", studentId: "student-sam", enrolledAt: "2026-05-03" },
  { courseId: "course-capstone-summer", studentId: "student-ari", enrolledAt: "2026-06-01" },
  { courseId: "course-capstone-summer", studentId: "student-lina", enrolledAt: "2026-06-01" }
];

export const projects: Project[] = [
  {
    id: "project-emberfall",
    courseId: "course-engine-spring",
    name: "Emberfall Arena",
    description: "A third-person arena prototype focused on readable combat, responsive movement, and scalable encounter design.",
    teamMemberIds: ["student-ari", "student-maya", "student-noah"],
    platform: "Windows PC",
    techStack: "Unreal Engine 5, C++, Blueprints",
    githubUrl: "https://github.com/example/emberfall-arena",
    buildUrl: "https://example.com/builds/emberfall",
    inviteCode: "EMBER-27",
    currentMilestone: "Vertical Slice",
    health: "Ready for Review",
    lastUpdated: "2026-06-14"
  },
  {
    id: "project-orbit",
    courseId: "course-engine-spring",
    name: "Orbit Salvage",
    description: "A cooperative space salvage game exploring physics-driven tools, modular ship interiors, and team role coordination.",
    teamMemberIds: ["student-jules", "student-sam"],
    platform: "Windows PC",
    techStack: "Unity, C#",
    githubUrl: "https://github.com/example/orbit-salvage",
    inviteCode: "ORBIT-91",
    currentMilestone: "Prototype",
    health: "At Risk",
    lastUpdated: "2026-06-08"
  },
  {
    id: "project-starlace",
    courseId: "course-capstone-summer",
    name: "Starlace Tools",
    description: "A production tooling project for authoring narrative dialogue, encounter flags, and localization exports.",
    teamMemberIds: ["student-lina"],
    platform: "Web",
    techStack: "Next.js, TypeScript, Supabase",
    githubUrl: "https://github.com/example/starlace-tools",
    inviteCode: "LACE-44",
    currentMilestone: "Project Proposal",
    health: "Active",
    lastUpdated: "2026-06-13"
  }
];

export const projectMemberships: ProjectMembership[] = [
  { projectId: "project-emberfall", studentId: "student-ari", joinedAt: "2026-05-04", role: "Owner" },
  { projectId: "project-emberfall", studentId: "student-maya", joinedAt: "2026-05-04", role: "Member" },
  { projectId: "project-emberfall", studentId: "student-noah", joinedAt: "2026-05-05", role: "Member" },
  { projectId: "project-orbit", studentId: "student-jules", joinedAt: "2026-05-05", role: "Owner" },
  { projectId: "project-orbit", studentId: "student-sam", joinedAt: "2026-05-06", role: "Member" },
  { projectId: "project-starlace", studentId: "student-lina", joinedAt: "2026-06-02", role: "Owner" }
];

export const devlogEntries: DevlogEntry[] = [
  {
    id: "log-001",
    projectId: "project-emberfall",
    date: "2026-06-14",
    author: "Ari Chen",
    hoursWorked: 4.5,
    category: "Programming",
    workCompleted: "Implemented lock-on targeting, camera shoulder swap, and first pass hit reaction timing for light attacks.",
    problemsEncountered: "Camera collision still clips when the player backs into tight corners.",
    blockers: "Needs one animation export before combo timing can be finalized.",
    nextSteps: "Tune camera obstruction behavior and connect heavy attack animation once exported.",
    evidenceUrl: "https://example.com/videos/emberfall-lockon",
    aiSummary: "Combat interaction work advanced with targeting and camera improvements; animation dependency remains."
  },
  {
    id: "log-002",
    projectId: "project-emberfall",
    date: "2026-06-12",
    author: "Maya Patel",
    hoursWorked: 3,
    category: "Art",
    workCompleted: "Blocked out arena sightlines and added temporary material color coding for navigation testing.",
    problemsEncountered: "Some cover pieces are too visually noisy during combat.",
    blockers: "None.",
    nextSteps: "Simplify cover silhouettes and prepare screenshots for vertical slice review."
  },
  {
    id: "log-003",
    projectId: "project-orbit",
    date: "2026-06-08",
    author: "Jules Rivera",
    hoursWorked: 2,
    category: "Research",
    workCompleted: "Tested three approaches for zero-gravity object pickup and chose configurable joints for the next prototype pass.",
    problemsEncountered: "Networked physics behavior is unpredictable when two players grab the same object.",
    blockers: "Needs instructor feedback on whether to reduce co-op physics scope.",
    nextSteps: "Build a narrow two-player test scene and compare interaction stability."
  }
];

export const courseMilestones: CourseMilestone[] = [
  {
    id: "course-mile-proposal",
    courseId: "course-engine-spring",
    name: "Project Proposal",
    description: "Teams define scope, platform, core loop, risks, and first technical goals.",
    dueDate: "2026-05-10",
    requiredEvidence: ["Design summary", "Repository link", "Team roles"]
  },
  {
    id: "course-mile-prototype",
    courseId: "course-engine-spring",
    name: "Prototype",
    description: "Teams demonstrate the core interaction in a rough but playable state.",
    dueDate: "2026-06-12",
    requiredEvidence: ["Playable build", "Short demo video", "Known issues"]
  },
  {
    id: "course-mile-vertical",
    courseId: "course-engine-spring",
    name: "Vertical Slice",
    description: "Teams submit a polished sample that represents the target experience.",
    dueDate: "2026-06-17",
    requiredEvidence: ["Build link", "Screenshots or video", "Milestone notes"]
  }
];

export const milestones: Milestone[] = [
  {
    id: "mile-001",
    projectId: "project-emberfall",
    courseMilestoneId: "course-mile-proposal",
    name: "Project Proposal",
    dueDate: "2026-05-10",
    status: "Approved",
    instructorFeedback: "Clear core loop and realistic vertical slice target."
  },
  {
    id: "mile-002",
    projectId: "project-emberfall",
    courseMilestoneId: "course-mile-vertical",
    name: "Vertical Slice",
    dueDate: "2026-06-17",
    status: "Ready for Review",
    submissionUrl: "https://example.com/builds/emberfall"
  },
  {
    id: "mile-003",
    projectId: "project-orbit",
    courseMilestoneId: "course-mile-prototype",
    name: "Prototype",
    dueDate: "2026-06-12",
    status: "Needs Revision",
    instructorFeedback: "Reduce scope and show one reliable multiplayer interaction before expanding systems."
  }
];

export const reviewRequests: ReviewRequest[] = [
  {
    id: "review-001",
    projectId: "project-emberfall",
    milestoneId: "mile-002",
    requestedAt: "2026-06-14",
    notes: "Vertical slice build is ready with core combat, arena blockout, and short capture video.",
    status: "Pending"
  },
  {
    id: "review-002",
    projectId: "project-orbit",
    milestoneId: "mile-003",
    requestedAt: "2026-06-10",
    notes: "Prototype submitted, but networking instability needs review.",
    status: "Needs Revision"
  }
];

export function getProjectHours(projectId: string) {
  return devlogEntries
    .filter((entry) => entry.projectId === projectId)
    .reduce((total, entry) => total + entry.hoursWorked, 0);
}

export function getRecentEntries(projectId: string) {
  return devlogEntries
    .filter((entry) => entry.projectId === projectId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getProfileName(profileId: string) {
  return profiles.find((profile) => profile.id === profileId)?.displayName ?? "Unknown student";
}

export function getTeamNames(project: Project) {
  return project.teamMemberIds.map(getProfileName);
}

export function getEnrolledCourses(studentId: string) {
  const courseIds = new Set(courseEnrollments.filter((enrollment) => enrollment.studentId === studentId).map((enrollment) => enrollment.courseId));
  return courses.filter((course) => courseIds.has(course.id));
}

export function getCourseStudents(courseId: string) {
  const studentIds = new Set(courseEnrollments.filter((enrollment) => enrollment.courseId === courseId).map((enrollment) => enrollment.studentId));
  return profiles.filter((profile) => studentIds.has(profile.id));
}

export function getStudentProjects(studentId: string, courseId?: string) {
  const projectIds = new Set(projectMemberships.filter((membership) => membership.studentId === studentId).map((membership) => membership.projectId));
  return projects.filter((project) => projectIds.has(project.id) && (!courseId || project.courseId === courseId));
}

export function getJoinableProjects(studentId: string, courseId: string) {
  const joinedIds = new Set(getStudentProjects(studentId).map((project) => project.id));
  return projects.filter((project) => project.courseId === courseId && !joinedIds.has(project.id));
}

export function getCourseMilestones(courseId: string) {
  return courseMilestones.filter((milestone) => milestone.courseId === courseId).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function getProjectMilestones(projectId: string) {
  return milestones.filter((milestone) => milestone.projectId === projectId).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getCourseProjects(courseId: string) {
  return projects.filter((project) => project.courseId === courseId);
}
