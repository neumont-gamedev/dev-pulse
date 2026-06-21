export type UserRole = "student" | "instructor";

export type Profile = {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  section: string;
  term: string;
  description?: string;
  startDate: string;
  endDate?: string;
  instructorId: string;
  joinPolicy: "Invite Code";
  isActive: boolean;
  accent: "blue" | "green" | "slate";
  themeGradient?: "blue" | "green" | "slate" | "purple" | "gold" | "rose";
  imageUrl?: string;
  imageLabel: string;
};

export type CourseEnrollment = {
  courseId: string;
  studentId: string;
  enrolledAt: string;
};

export type MilestoneStatus =
  | "Not Started"
  | "In Progress"
  | "Ready for Review"
  | "Approved"
  | "Needs Revision";

export type ProjectHealth = "Active" | "At Risk" | "Behind Schedule" | "On Track" | "Ready for Review";

export type DevlogEntry = {
  id: string;
  projectId: string;
  date: string;
  author: string;
  hoursWorked: number;
  category: "Programming" | "Design" | "Art" | "Audio" | "Research" | "Testing" | "Documentation" | "Team Meeting";
  workCompleted: string;
  problemsEncountered: string;
  blockers: string;
  nextSteps: string;
  evidenceUrl?: string;
  aiSummary?: string;
};

export type Milestone = {
  id: string;
  projectId: string;
  courseMilestoneId?: string;
  name: string;
  dueDate: string;
  status: MilestoneStatus;
  submissionUrl?: string;
  instructorFeedback?: string;
};

export type CourseMilestone = {
  id: string;
  courseId: string;
  name: string;
  description: string;
  dueDate: string;
  requiredEvidence: string[];
};

export type Project = {
  id: string;
  courseId: string;
  name: string;
  description: string;
  teamMemberIds: string[];
  platform: string;
  techStack: string;
  githubUrl: string;
  buildUrl?: string;
  inviteCode: string;
  currentMilestone: string;
  health: ProjectHealth;
  lastUpdated: string;
};

export type ProjectMembership = {
  projectId: string;
  studentId: string;
  joinedAt: string;
  role: "Owner" | "Member";
};

export type ReviewRequest = {
  id: string;
  projectId: string;
  milestoneId: string;
  requestedAt: string;
  notes: string;
  status: "Pending" | "Approved" | "Needs Revision";
};
