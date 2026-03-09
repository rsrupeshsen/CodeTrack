import { databases, DB_ID, PROFILES_ID, QUESTIONS_ID, ID, Query } from "./appwrite";

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
  const existing = await getProfileByUserId(userId);
  if (existing) {
    return databases.updateDocument(DB_ID, PROFILES_ID, existing.$id, data);
  }
  return databases.createDocument(DB_ID, PROFILES_ID, ID.unique(),
    { userId, ...data });
}

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