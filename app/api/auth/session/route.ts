import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getSessionCookieName } from "@/lib/current-user";
import { getProfileFromFirestore } from "@/lib/firestore-data";

const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const { idToken } = (await request.json()) as { idToken?: string };

  if (!idToken) {
    return NextResponse.json({ message: "Missing Firebase ID token." }, { status: 400 });
  }

  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const profile = await getProfileFromFirestore(decodedToken.uid);

  if (!profile) {
    return NextResponse.json({ message: "No Dev Pulse profile exists for this account." }, { status: 403 });
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: fiveDaysInMilliseconds
  });
  const response = NextResponse.json({ profile });

  response.cookies.set(getSessionCookieName(), sessionCookie, {
    httpOnly: true,
    maxAge: fiveDaysInMilliseconds / 1000,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}
