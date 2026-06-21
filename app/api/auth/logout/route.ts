import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/current-user";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}
