import { existsSync, readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? ".firebase/service-account.json";

if (!existsSync(serviceAccountPath)) {
  console.error(`Missing Firebase service account file: ${serviceAccountPath}`);
  console.error("Create one in Firebase Console > Project settings > Service accounts > Generate new private key.");
  console.error("Save it as .firebase/service-account.json, then run npm run seed:firestore again.");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const auth = getAuth();
const db = getFirestore();

const users = [
  { id: "instructor-maple", displayName: "Professor Maple", email: "rmaple@neumont.edu", role: "instructor" },
  { id: "student-ari", displayName: "Ari Chen", email: "ari.chen@student.neumont.edu", role: "student" },
  { id: "student-maya", displayName: "Maya Patel", email: "maya.patel@student.neumont.edu", role: "student" },
  { id: "student-noah", displayName: "Noah Kim", email: "noah.kim@student.neumont.edu", role: "student" },
  { id: "student-jules", displayName: "Jules Rivera", email: "jules.rivera@student.neumont.edu", role: "student" },
  { id: "student-sam", displayName: "Sam Brooks", email: "sam.brooks@student.neumont.edu", role: "student" },
  { id: "student-lina", displayName: "Lina Torres", email: "lina.torres@student.neumont.edu", role: "student" }
];

const courses = [
  {
    id: "course-engine-spring",
    name: "Senior Game Engine",
    code: "PRO385",
    section: "GE-410-A",
    term: "Spring 2026",
    startDate: "2026-05-05",
    instructorId: "instructor-maple",
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
    instructorId: "instructor-maple",
    joinPolicy: "Invite Code",
    isActive: true,
    accent: "blue",
    imageLabel: "CAPSTONE STUDIO"
  }
];

const courseEnrollments = [
  { id: "course-engine-spring_student-ari", courseId: "course-engine-spring", studentId: "student-ari", enrolledAt: "2026-05-01" },
  { id: "course-engine-spring_student-maya", courseId: "course-engine-spring", studentId: "student-maya", enrolledAt: "2026-05-01" },
  { id: "course-engine-spring_student-noah", courseId: "course-engine-spring", studentId: "student-noah", enrolledAt: "2026-05-01" },
  { id: "course-engine-spring_student-jules", courseId: "course-engine-spring", studentId: "student-jules", enrolledAt: "2026-05-03" },
  { id: "course-engine-spring_student-sam", courseId: "course-engine-spring", studentId: "student-sam", enrolledAt: "2026-05-03" },
  { id: "course-capstone-summer_student-ari", courseId: "course-capstone-summer", studentId: "student-ari", enrolledAt: "2026-06-01" },
  { id: "course-capstone-summer_student-lina", courseId: "course-capstone-summer", studentId: "student-lina", enrolledAt: "2026-06-01" }
];

const projects = [
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
    techStack: "Next.js, TypeScript, Firebase",
    githubUrl: "https://github.com/example/starlace-tools",
    inviteCode: "LACE-44",
    currentMilestone: "Project Proposal",
    health: "Active",
    lastUpdated: "2026-06-13"
  }
];

const projectMembers = [
  { id: "project-emberfall_student-ari", projectId: "project-emberfall", studentId: "student-ari", joinedAt: "2026-05-04", role: "Owner" },
  { id: "project-emberfall_student-maya", projectId: "project-emberfall", studentId: "student-maya", joinedAt: "2026-05-04", role: "Member" },
  { id: "project-emberfall_student-noah", projectId: "project-emberfall", studentId: "student-noah", joinedAt: "2026-05-05", role: "Member" },
  { id: "project-orbit_student-jules", projectId: "project-orbit", studentId: "student-jules", joinedAt: "2026-05-05", role: "Owner" },
  { id: "project-orbit_student-sam", projectId: "project-orbit", studentId: "student-sam", joinedAt: "2026-05-06", role: "Member" },
  { id: "project-starlace_student-lina", projectId: "project-starlace", studentId: "student-lina", joinedAt: "2026-06-02", role: "Owner" }
];

const courseMilestones = [
  { id: "course-mile-proposal", courseId: "course-engine-spring", name: "Project Proposal", description: "Teams define scope, platform, core loop, risks, and first technical goals.", dueDate: "2026-05-10", requiredEvidence: ["Design summary", "Repository link", "Team roles"] },
  { id: "course-mile-prototype", courseId: "course-engine-spring", name: "Prototype", description: "Teams demonstrate the core interaction in a rough but playable state.", dueDate: "2026-06-12", requiredEvidence: ["Playable build", "Short demo video", "Known issues"] },
  { id: "course-mile-vertical", courseId: "course-engine-spring", name: "Vertical Slice", description: "Teams submit a polished sample that represents the target experience.", dueDate: "2026-06-17", requiredEvidence: ["Build link", "Screenshots or video", "Milestone notes"] }
];

const milestones = [
  { id: "mile-001", projectId: "project-emberfall", courseMilestoneId: "course-mile-proposal", name: "Project Proposal", dueDate: "2026-05-10", status: "Approved", instructorFeedback: "Clear core loop and realistic vertical slice target." },
  { id: "mile-002", projectId: "project-emberfall", courseMilestoneId: "course-mile-vertical", name: "Vertical Slice", dueDate: "2026-06-17", status: "Ready for Review", submissionUrl: "https://example.com/builds/emberfall" },
  { id: "mile-003", projectId: "project-orbit", courseMilestoneId: "course-mile-prototype", name: "Prototype", dueDate: "2026-06-12", status: "Needs Revision", instructorFeedback: "Reduce scope and show one reliable multiplayer interaction before expanding systems." }
];

const devlogs = [
  {
    id: "log-001",
    projectId: "project-emberfall",
    date: "2026-06-14",
    authorId: "student-ari",
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
    authorId: "student-maya",
    author: "Maya Patel",
    hoursWorked: 3,
    category: "Art",
    workCompleted: "Blocked out arena sightlines and added temporary material color coding for navigation testing.",
    problemsEncountered: "Some cover pieces are too visually noisy during combat.",
    blockers: "None.",
    nextSteps: "Simplify cover silhouettes and prepare screenshots for vertical slice review."
  }
];

const reviewRequests = [
  { id: "review-001", projectId: "project-emberfall", milestoneId: "mile-002", requestedAt: "2026-06-14", notes: "Vertical slice build is ready with core combat, arena blockout, and short capture video.", status: "Pending" },
  { id: "review-002", projectId: "project-orbit", milestoneId: "mile-003", requestedAt: "2026-06-10", notes: "Prototype submitted, but networking instability needs review.", status: "Needs Revision" }
];

const collections = [
  ["users", users],
  ["courses", courses],
  ["courseEnrollments", courseEnrollments],
  ["projects", projects],
  ["projectMembers", projectMembers],
  ["courseMilestones", courseMilestones],
  ["milestones", milestones],
  ["devlogs", devlogs],
  ["reviewRequests", reviewRequests]
];

await seedAuthUsers();
await seedFirestore();

console.log("Seed complete.");
console.log("Temporary password for seeded users: DevPulse123!");

async function seedAuthUsers() {
  for (const user of users) {
    try {
      await auth.getUser(user.id);
      await auth.updateUser(user.id, {
        email: user.email,
        displayName: user.displayName
      });
    } catch (error) {
      if (error.code !== "auth/user-not-found") {
        throw error;
      }

      await auth.createUser({
        uid: user.id,
        email: user.email,
        displayName: user.displayName,
        password: "DevPulse123!",
        emailVerified: true
      });
    }
  }
}

async function seedFirestore() {
  let batch = db.batch();
  let operationCount = 0;

  for (const [collectionName, documents] of collections) {
    for (const document of documents) {
      const { id, ...data } = document;
      batch.set(db.collection(collectionName).doc(id), data, { merge: true });
      operationCount += 1;

      if (operationCount === 450) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }
}
