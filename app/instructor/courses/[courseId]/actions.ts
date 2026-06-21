"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminAuth, adminFirestore } from "@/lib/firebase-admin";
import { requireRole } from "@/lib/current-user";
import { getCourseFromFirestore, getProfileFromFirestore } from "@/lib/firestore-data";

const temporaryPassword = "DevPulse123!";

export async function addStudentToCourse(formData: FormData) {
  const instructor = await requireRole("instructor");
  const courseId = getRequiredValue(formData, "courseId");
  const email = getRequiredValue(formData, "email").toLowerCase();
  const displayName = getOptionalValue(formData, "displayName") ?? getDisplayNameFromEmail(email);
  const course = await getCourseFromFirestore(courseId);

  if (!course || course.instructorId !== instructor.id) {
    redirect("/instructor");
  }

  let userRecord;

  try {
    userRecord = await adminAuth.getUserByEmail(email);
  } catch (error) {
    if (!isAuthUserNotFoundError(error)) {
      throw error;
    }

    userRecord = await adminAuth.createUser({
      displayName,
      email,
      emailVerified: true,
      password: temporaryPassword
    });
  }

  const existingProfile = await getProfileFromFirestore(userRecord.uid);

  await adminFirestore.collection("users").doc(userRecord.uid).set(
    {
      displayName: existingProfile?.displayName ?? userRecord.displayName ?? displayName,
      email,
      role: "student"
    },
    { merge: true }
  );

  await adminFirestore.collection("courseEnrollments").doc(`${courseId}_${userRecord.uid}`).set(
    {
      courseId,
      studentId: userRecord.uid,
      enrolledAt: new Date().toISOString().slice(0, 10)
    },
    { merge: true }
  );

  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function removeStudentFromCourse(formData: FormData) {
  const instructor = await requireRole("instructor");
  const courseId = getRequiredValue(formData, "courseId");
  const studentId = getRequiredValue(formData, "studentId");
  const course = await getCourseFromFirestore(courseId);

  if (!course || course.instructorId !== instructor.id) {
    redirect("/instructor");
  }

  const courseProjectsSnapshot = await adminFirestore.collection("projects").where("courseId", "==", courseId).get();
  const membershipSnapshots = await Promise.all(
    courseProjectsSnapshot.docs.map((projectSnapshot) =>
      adminFirestore
        .collection("projectMembers")
        .where("projectId", "==", projectSnapshot.id)
        .where("studentId", "==", studentId)
        .get()
    )
  );
  const batch = adminFirestore.batch();

  batch.delete(adminFirestore.collection("courseEnrollments").doc(`${courseId}_${studentId}`));

  for (const projectSnapshot of courseProjectsSnapshot.docs) {
    batch.update(projectSnapshot.ref, {
      teamMemberIds: FieldValue.arrayRemove(studentId)
    });
  }

  for (const membershipSnapshot of membershipSnapshots) {
    for (const membershipDocument of membershipSnapshot.docs) {
      batch.delete(membershipDocument.ref);
    }
  }

  await batch.commit();
  revalidatePath(`/instructor/courses/${courseId}`);
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
    return null;
  }

  return value.trim();
}

function getDisplayNameFromEmail(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isAuthUserNotFoundError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "auth/user-not-found";
}
