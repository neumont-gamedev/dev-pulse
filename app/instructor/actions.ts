"use server";

import { revalidatePath } from "next/cache";
import { adminFirestore } from "@/lib/firebase-admin";
import { requireRole } from "@/lib/current-user";

export type CourseActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

export async function createCourse(_previousState: CourseActionState, formData: FormData): Promise<CourseActionState> {
  const instructor = await requireRole("instructor");
  const name = getRequiredValue(formData, "name");
  const code = getRequiredValue(formData, "code").toUpperCase();
  const term = getRequiredValue(formData, "term");
  const description = getRequiredValue(formData, "description");
  const startDate = getRequiredValue(formData, "startDate");
  const endDate = getRequiredValue(formData, "endDate");
  const themeGradient = getRequiredValue(formData, "themeGradient");
  const imageUrl = getOptionalValue(formData, "imageUrl");
  const courseRef = adminFirestore.collection("courses").doc(createCourseId(code, term));
  const existingCourse = await courseRef.get();

  if (existingCourse.exists) {
    return {
      message: `${code} already has a project for ${term}.`,
      status: "error"
    };
  }

  await courseRef.set({
    accent: getAccentFromTheme(themeGradient),
    code,
    description,
    endDate,
    imageLabel: name.toUpperCase(),
    imageUrl,
    instructorId: instructor.id,
    isActive: true,
    joinPolicy: "Invite Code",
    name,
    section: "",
    startDate,
    term,
    themeGradient
  });

  revalidatePath("/instructor");

  return {
    message: `${name} was created.`,
    status: "success"
  };
}

export async function deleteCourse(formData: FormData) {
  const instructor = await requireRole("instructor");
  const courseId = getRequiredValue(formData, "courseId");
  const courseRef = adminFirestore.collection("courses").doc(courseId);
  const courseSnapshot = await courseRef.get();

  if (!courseSnapshot.exists || courseSnapshot.data()?.instructorId !== instructor.id) {
    revalidatePath("/instructor");
    return;
  }

  const [enrollmentsSnapshot, courseMilestonesSnapshot, projectsSnapshot] = await Promise.all([
    adminFirestore.collection("courseEnrollments").where("courseId", "==", courseId).get(),
    adminFirestore.collection("courseMilestones").where("courseId", "==", courseId).get(),
    adminFirestore.collection("projects").where("courseId", "==", courseId).get()
  ]);
  const courseMilestoneIds = courseMilestonesSnapshot.docs.map((documentSnapshot) => documentSnapshot.id);
  const projectIds = projectsSnapshot.docs.map((documentSnapshot) => documentSnapshot.id);
  const [projectMembersSnapshots, projectMilestonesSnapshots, devlogSnapshots, reviewRequestSnapshots] = await Promise.all([
    Promise.all(projectIds.map((projectId) => adminFirestore.collection("projectMembers").where("projectId", "==", projectId).get())),
    Promise.all([
      ...projectIds.map((projectId) => adminFirestore.collection("milestones").where("projectId", "==", projectId).get()),
      ...courseMilestoneIds.map((milestoneId) => adminFirestore.collection("milestones").where("courseMilestoneId", "==", milestoneId).get())
    ]),
    Promise.all(projectIds.map((projectId) => adminFirestore.collection("devlogs").where("projectId", "==", projectId).get())),
    Promise.all(projectIds.map((projectId) => adminFirestore.collection("reviewRequests").where("projectId", "==", projectId).get()))
  ]);
  const references = [
    courseRef,
    ...enrollmentsSnapshot.docs.map((documentSnapshot) => documentSnapshot.ref),
    ...courseMilestonesSnapshot.docs.map((documentSnapshot) => documentSnapshot.ref),
    ...projectsSnapshot.docs.map((documentSnapshot) => documentSnapshot.ref),
    ...projectMembersSnapshots.flatMap((snapshot) => snapshot.docs.map((documentSnapshot) => documentSnapshot.ref)),
    ...projectMilestonesSnapshots.flatMap((snapshot) => snapshot.docs.map((documentSnapshot) => documentSnapshot.ref)),
    ...devlogSnapshots.flatMap((snapshot) => snapshot.docs.map((documentSnapshot) => documentSnapshot.ref)),
    ...reviewRequestSnapshots.flatMap((snapshot) => snapshot.docs.map((documentSnapshot) => documentSnapshot.ref))
  ];
  const uniqueReferences = Array.from(new Map(references.map((reference) => [reference.path, reference])).values());

  for (let index = 0; index < uniqueReferences.length; index += 450) {
    const batch = adminFirestore.batch();

    for (const reference of uniqueReferences.slice(index, index + 450)) {
      batch.delete(reference);
    }

    await batch.commit();
  }

  revalidatePath("/instructor");
}

function getRequiredValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing ${key}.`);
  }

  return value.trim();
}

function getOptionalValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  return value.trim();
}

function createCourseId(code: string, term: string) {
  return `${code}-${term}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getAccentFromTheme(themeGradient: string) {
  if (themeGradient === "green") {
    return "green";
  }

  if (themeGradient === "slate") {
    return "slate";
  }

  return "blue";
}
