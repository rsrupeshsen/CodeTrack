import { databases, DB_ID, PROFILES_ID, QUESTIONS_ID, ID, Query } from "./appwrite";

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

export async function upsertProfile(userId: string, data: any) {
  // Check if username is being changed and if it's already taken
  if (data.username) {
    const existingByUsername = await getProfileByUsername(data.username);
    if (existingByUsername && existingByUsername.userId !== userId) {
      throw new Error("Username already taken. Please choose a different username.");
    }
  }

  const existing = await getProfileByUserId(userId);
  if (existing) {
    return databases.updateDocument(DB_ID, PROFILES_ID, existing.$id, data);
  }
  return databases.createDocument(DB_ID, PROFILES_ID, ID.unique(),
    { userId, ...data });
}

// ── Questions Functions (existing) ─────────────────────────────────────────────

export async function getQuestions(userId: string) {
  const r = await databases.listDocuments(DB_ID, QUESTIONS_ID,
    [Query.equal("userId", userId), Query.orderDesc("$createdAt")]);
  return r.documents;
}

export const addQuestion = (userId: string, data: any) =>
  databases.createDocument(DB_ID, QUESTIONS_ID, ID.unique(), { userId, ...data });

export const updateQuestion = (docId: string, data: any) =>
  databases.updateDocument(DB_ID, QUESTIONS_ID, docId, data);

export const deleteQuestion = (docId: string) =>
  databases.deleteDocument(DB_ID, QUESTIONS_ID, docId);

// ── User Problems (QuestionTracker Personal Tab) ───────────────────────────────
// Collection ID: "user_problems"
// Required Attributes: userId (string), problems (JSON)

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
        existing.documents[0].$id, { problems });
    }
    return await databases.createDocument(DB_ID, USER_PROBLEMS_ID, ID.unique(),
      { userId, problems });
  } catch (err) {
    console.error("Failed to save user problems:", err);
    throw err;
  }
}

// ── User Sheet Progress (QuestionTracker Sheets Tab) ───────────────────────────
// Collection ID: "user_sheet_progress"
// Required Attributes: userId (string), sheetStatus (JSON)

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
        existing.documents[0].$id, { sheetStatus });
    }
    return await databases.createDocument(DB_ID, USER_SHEET_PROGRESS_ID, ID.unique(),
      { userId, sheetStatus });
  } catch (err) {
    console.error("Failed to save user sheet status:", err);
    throw err;
  }
}