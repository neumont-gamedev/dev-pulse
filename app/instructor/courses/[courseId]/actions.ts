"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminAuth, adminFirestore } from "@/lib/firebase-admin";
import { requireRole } from "@/lib/current-user";
import { getCourseFromFirestore, getProfileFromFirestore } from "@/lib/firestore-data";

const temporaryPassword = "DevPulse123!";

export type StudentEnrollmentActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

export type CourseMilestoneActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

export async function addStudentToCourse(_previousState: StudentEnrollmentActionState, formData: FormData): Promise<StudentEnrollmentActionState> {
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

  if (userRecord.uid === instructor.id || existingProfile?.role === "instructor") {
    return {
      message: "That account is an instructor and cannot be added as a student.",
      status: "error"
    };
  }

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

  return {
    message: `${existingProfile?.displayName ?? userRecord.displayName ?? displayName} is enrolled in ${course.code}.`,
    status: "success"
  };
}

export async function addCourseMilestone(_previousState: CourseMilestoneActionState, formData: FormData): Promise<CourseMilestoneActionState> {
  const { course, courseId } = await requireInstructorCourse(formData);
  const name = getRequiredValue(formData, "name");
  const dueDate = getRequiredValue(formData, "dueDate");
  const description = getRequiredValue(formData, "description");
  const requiredEvidence = parseEvidence(getOptionalValue(formData, "requiredEvidence"));
  const milestoneRef = adminFirestore.collection("courseMilestones").doc();
  const courseProjectsSnapshot = await adminFirestore.collection("projects").where("courseId", "==", courseId).get();
  const batch = adminFirestore.batch();

  batch.set(milestoneRef, {
    courseId,
    description,
    dueDate,
    name,
    requiredEvidence
  });

  for (const projectSnapshot of courseProjectsSnapshot.docs) {
    batch.set(adminFirestore.collection("milestones").doc(`${projectSnapshot.id}_${milestoneRef.id}`), {
      courseMilestoneId: milestoneRef.id,
      dueDate,
      name,
      projectId: projectSnapshot.id,
      status: "Not Started"
    });
  }

  await batch.commit();
  revalidatePath(`/instructor/courses/${courseId}`);

  return {
    message: `${name} was added to ${course.code}.`,
    status: "success"
  };
}

export async function updateCourseMilestone(_previousState: CourseMilestoneActionState, formData: FormData): Promise<CourseMilestoneActionState> {
  const { course, courseId } = await requireInstructorCourse(formData);
  const milestoneId = getRequiredValue(formData, "milestoneId");
  const name = getRequiredValue(formData, "name");
  const dueDate = getRequiredValue(formData, "dueDate");
  const description = getRequiredValue(formData, "description");
  const requiredEvidence = parseEvidence(getOptionalValue(formData, "requiredEvidence"));
  const milestoneRef = adminFirestore.collection("courseMilestones").doc(milestoneId);
  const milestoneSnapshot = await milestoneRef.get();

  if (!milestoneSnapshot.exists || milestoneSnapshot.data()?.courseId !== courseId) {
    return {
      message: "That milestone could not be found for this project.",
      status: "error"
    };
  }

  const projectMilestonesSnapshot = await adminFirestore.collection("milestones").where("courseMilestoneId", "==", milestoneId).get();
  const batch = adminFirestore.batch();

  batch.update(milestoneRef, {
    description,
    dueDate,
    name,
    requiredEvidence
  });

  for (const projectMilestone of projectMilestonesSnapshot.docs) {
    batch.update(projectMilestone.ref, {
      dueDate,
      name
    });
  }

  await batch.commit();
  revalidatePath(`/instructor/courses/${courseId}`);

  return {
    message: `${name} was updated for ${course.code}.`,
    status: "success"
  };
}

export async function deleteCourseMilestone(formData: FormData) {
  const { courseId } = await requireInstructorCourse(formData);
  const milestoneId = getRequiredValue(formData, "milestoneId");
  const milestoneRef = adminFirestore.collection("courseMilestones").doc(milestoneId);
  const milestoneSnapshot = await milestoneRef.get();

  if (!milestoneSnapshot.exists || milestoneSnapshot.data()?.courseId !== courseId) {
    revalidatePath(`/instructor/courses/${courseId}`);
    return;
  }

  const projectMilestonesSnapshot = await adminFirestore.collection("milestones").where("courseMilestoneId", "==", milestoneId).get();
  const batch = adminFirestore.batch();

  batch.delete(milestoneRef);

  for (const projectMilestone of projectMilestonesSnapshot.docs) {
    batch.delete(projectMilestone.ref);
  }

  await batch.commit();
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

async function requireInstructorCourse(formData: FormData) {
  const instructor = await requireRole("instructor");
  const courseId = getRequiredValue(formData, "courseId");
  const course = await getCourseFromFirestore(courseId);

  if (!course || course.instructorId !== instructor.id) {
    redirect("/instructor");
  }

  return { course, courseId, instructor };
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

function parseEvidence(value: string | null) {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function isAuthUserNotFoundError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "auth/user-not-found";
}
