import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "./firebase-admin";
import { getProfileFromFirestore } from "./firestore-data";
import type { Profile, UserRole } from "./types";

const sessionCookieName = "dev_pulse_session";

export async function getCurrentUserProfile() {
  const sessionCookie = cookies().get(sessionCookieName)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    return getProfileFromFirestore(decodedToken.uid);
  } catch {
    return null;
  }
}

export async function requireCurrentUserProfile() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireRole(role: UserRole) {
  const profile = await requireCurrentUserProfile();

  if (profile.role !== role) {
    redirect(profile.role === "instructor" ? "/instructor" : "/");
  }

  return profile;
}

export function getSessionCookieName() {
  return sessionCookieName;
}

export function getDefaultLandingPath(profile: Profile) {
  return profile.role === "instructor" ? "/instructor" : "/";
}
