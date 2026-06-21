import { existsSync, readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? ".firebase/service-account.json";

if (!getApps().length) {
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  } else {
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
  }
}

export const adminFirestore = getFirestore();
