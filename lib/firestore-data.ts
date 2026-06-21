import { adminFirestore } from "./firebase-admin";
import type { Course, CourseEnrollment, CourseMilestone, DevlogEntry, Milestone, Profile, Project, ProjectMembership, ReviewRequest } from "./types";

export const currentStudentId = "student-ari";
export const currentInstructorId = "instructor-maple";

export async function getProfileFromFirestore(profileId: string) {
  return getDocument<Profile>("users", profileId);
}

export async function getEnrolledCoursesFromFirestore(studentId: string) {
  const enrollments = await getCollectionWhere<CourseEnrollment>("courseEnrollments", "studentId", studentId);
  const courses = await Promise.all(enrollments.map((enrollment) => getCourseFromFirestore(enrollment.courseId)));

  return courses.filter((course): course is Course => course !== null);
}

export async function getInstructorCoursesFromFirestore(instructorId: string) {
  const courses = await getCollectionWhere<Course>("courses", "instructorId", instructorId);

  return courses.sort((a, b) => a.code.localeCompare(b.code));
}

export async function getCourseFromFirestore(courseId: string) {
  return getDocument<Course>("courses", courseId);
}

export async function getCourseStudentsFromFirestore(courseId: string) {
  const enrollments = await getCollectionWhere<CourseEnrollment>("courseEnrollments", "courseId", courseId);
  const students = await Promise.all(enrollments.map((enrollment) => getProfileFromFirestore(enrollment.studentId)));

  return students
    .filter((student): student is Profile => student !== null)
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function getCourseProjectsFromFirestore(courseId: string) {
  const projects = await getCollectionWhere<Project>("projects", "courseId", courseId);

  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getJoinableProjectsFromFirestore(studentId: string, courseId: string) {
  const [courseProjects, studentProjects] = await Promise.all([
    getCourseProjectsFromFirestore(courseId),
    getStudentProjectsFromFirestore(studentId)
  ]);
  const joinedIds = new Set(studentProjects.map((project) => project.id));

  return courseProjects.filter((project) => !joinedIds.has(project.id));
}

export async function getStudentProjectsFromFirestore(studentId: string, courseId?: string) {
  const memberships = await getCollectionWhere<ProjectMembership>("projectMembers", "studentId", studentId);
  const projects = await Promise.all(memberships.map((membership) => getProjectFromFirestore(membership.projectId)));

  return projects.filter((project): project is Project => {
    if (!project) {
      return false;
    }

    return !courseId || project.courseId === courseId;
  });
}

export async function getCourseMilestonesFromFirestore(courseId: string) {
  const milestones = await getCollectionWhere<CourseMilestone>("courseMilestones", "courseId", courseId);

  return milestones.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function getProjectMilestonesFromFirestore(projectId: string) {
  const milestones = await getCollectionWhere<Milestone>("milestones", "projectId", projectId);

  return milestones.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function getProjectDevlogsFromFirestore(projectId: string) {
  const entries = await getCollectionWhere<DevlogEntry>("devlogs", "projectId", projectId);

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getProjectHours(entries: DevlogEntry[]) {
  return entries.reduce((total, entry) => total + entry.hoursWorked, 0);
}

export async function getReviewRequestsFromFirestore() {
  const snapshot = await adminFirestore.collection("reviewRequests").get();

  return snapshot.docs.map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() }) as ReviewRequest);
}

export async function getProfilesByIdsFromFirestore(profileIds: string[]) {
  const uniqueIds = Array.from(new Set(profileIds));
  const profiles = await Promise.all(uniqueIds.map((profileId) => getProfileFromFirestore(profileId)));

  return profiles.filter((profile): profile is Profile => profile !== null);
}

async function getProjectFromFirestore(projectId: string) {
  return getDocument<Project>("projects", projectId);
}

async function getDocument<T extends object>(collectionName: string, id: string) {
  const snapshot = await adminFirestore.collection(collectionName).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() } as T;
}

async function getCollectionWhere<T extends object>(collectionName: string, field: string, value: string) {
  const snapshot = await adminFirestore.collection(collectionName).where(field, "==", value).get();

  return snapshot.docs.map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() }) as T);
}
