import { databases, DB_ID, PROFILES_ID, QUESTIONS_ID, ID, Query } from "./appwrite";
import { Permission, Role } from "appwrite";

// ── Profile Functions ──────────────────────────────────────────────────────────

export async function getProfileByUsername(username: string) {
  const r = await databases.listDocuments(DB_ID, PROFILES_ID,
    [Query.equal("username", username)]);
  return r.documents[0] || null;
}

export async function getProfileByUserId(userId: string) {
  const r = await databases.listDocuments(DB_ID, PROFILES_ID,
    [Query.equal("userId", userId)]);
  return r.documents[0] || null;
}

// ✅ FIX: Helper used on BOTH create AND update so old documents
// (created before this fix with no doc-level permissions) get locked
// to their owner on the very next save. This permanently stops overwrites.
function ownerPermissions(userId: string) {
  return [
    Permission.read(Role.any()),           // public profiles viewable by anyone
    Permission.update(Role.user(userId)),  // only owner can update
    Permission.delete(Role.user(userId)),  // only owner can delete
  ];
}

export async function upsertProfile(userId: string, data: any) {
  if (data.username) {
    const existingByUsername = await getProfileByUsername(data.username);
    if (existingByUsername && existingByUsername.userId !== userId) {
      throw new Error("Username already taken. Please choose a different username.");
    }
  }

  const existing = await getProfileByUserId(userId);
  if (existing) {
    if (existing.userId !== userId) {
      throw new Error("Permission denied: cannot modify another user's profile.");
    }
    // ✅ FIX: Pass ownerPermissions on update too — this retroactively locks
    // any old document that was created without doc-level permissions.
    return databases.updateDocument(
      DB_ID, PROFILES_ID, existing.$id,
      data,
      ownerPermissions(userId)
    );
  }

  return databases.createDocument(
    DB_ID, PROFILES_ID, ID.unique(),
    { userId, ...data },
    ownerPermissions(userId)
  );
}

// ── Questions Functions ────────────────────────────────────────────────────────

export async function getQuestions(userId: string) {
  const r = await databases.listDocuments(DB_ID, QUESTIONS_ID,
    [Query.equal("userId", userId), Query.orderDesc("$createdAt")]);
  return r.documents;
}

export const addQuestion = (userId: string, data: any) =>
  databases.createDocument(DB_ID, QUESTIONS_ID, ID.unique(), { userId, ...data }, [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ]);

export const updateQuestion = (docId: string, data: any) =>
  databases.updateDocument(DB_ID, QUESTIONS_ID, docId, data);

export const deleteQuestion = (docId: string) =>
  databases.deleteDocument(DB_ID, QUESTIONS_ID, docId);

// ── User Problems ──────────────────────────────────────────────────────────────

const USER_PROBLEMS_ID = "user_problems";

export async function getUserProblems(userId: string) {
  try {
    const r = await databases.listDocuments(DB_ID, USER_PROBLEMS_ID,
      [Query.equal("userId", userId)]);
    return r.documents[0]?.problems || [];
  } catch (err) {
    console.error("Failed to get user problems:", err);
    return [];
  }
}

export async function saveUserProblems(userId: string, problems: any[]) {
  try {
    const existing = await databases.listDocuments(DB_ID, USER_PROBLEMS_ID,
      [Query.equal("userId", userId)]);
    if (existing.documents.length > 0) {
      return await databases.updateDocument(DB_ID, USER_PROBLEMS_ID,
        existing.documents[0].$id, { problems }, [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]);
    }
    return await databases.createDocument(DB_ID, USER_PROBLEMS_ID, ID.unique(),
      { userId, problems }, [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]);
  } catch (err) {
    console.error("Failed to save user problems:", err);
    throw err;
  }
}

// ── User Sheet Progress ────────────────────────────────────────────────────────

const USER_SHEET_PROGRESS_ID = "user_sheet_progress";

export async function getUserSheetStatus(userId: string) {
  try {
    const r = await databases.listDocuments(DB_ID, USER_SHEET_PROGRESS_ID,
      [Query.equal("userId", userId)]);
    return r.documents[0]?.sheetStatus || {};
  } catch (err) {
    console.error("Failed to get user sheet status:", err);
    return {};
  }
}

export async function saveUserSheetStatus(userId: string, sheetStatus: any) {
  try {
    const existing = await databases.listDocuments(DB_ID, USER_SHEET_PROGRESS_ID,
      [Query.equal("userId", userId)]);
    if (existing.documents.length > 0) {
      return await databases.updateDocument(DB_ID, USER_SHEET_PROGRESS_ID,
        existing.documents[0].$id, { sheetStatus }, [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]);
    }
    return await databases.createDocument(DB_ID, USER_SHEET_PROGRESS_ID, ID.unique(),
      { userId, sheetStatus }, [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]);
  } catch (err) {
    console.error("Failed to save user sheet status:", err);
    throw err;
  }
}