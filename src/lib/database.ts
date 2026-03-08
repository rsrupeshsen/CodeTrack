import { databases, DB_ID, PROFILES_ID, QUESTIONS_ID, ID, Query } from "./appwrite";

export async function getProfileByUsername(username: string) {
  const r = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: PROFILES_ID,
    queries: [Query.equal("username", username)],
  });
  return r.documents[0] || null;
}

export async function getProfileByUserId(userId: string) {
  const r = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: PROFILES_ID,
    queries: [Query.equal("userId", userId)],
  });
  return r.documents[0] || null;
}

export async function upsertProfile(userId: string, data: object) {
  const existing = await getProfileByUserId(userId);

  if (existing) {
    return databases.updateDocument(
      DB_ID,
      PROFILES_ID,
      existing.$id,
      data
    );
  }

  return databases.createDocument(
    DB_ID,
    PROFILES_ID,
    ID.unique(),
    { userId, ...data }
  );
}

export async function getQuestions(userId: string) {
  const r = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: QUESTIONS_ID,
    queries: [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ],
  });

  return r.documents;
}

export const addQuestion = (userId: string, data: object) =>
  databases.createDocument(
    DB_ID,
    QUESTIONS_ID,
    ID.unique(),
    { userId, ...data }
  );

export const updateQuestion = (docId: string, data: object) =>
  databases.updateDocument(
    DB_ID,
    QUESTIONS_ID,
    docId,
    data
  );

export const deleteQuestion = (docId: string) =>
  databases.deleteDocument(
    DB_ID,
    QUESTIONS_ID,
    docId
  );