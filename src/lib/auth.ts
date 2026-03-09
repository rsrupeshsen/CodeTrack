import { OAuthProvider } from "appwrite";
import { account, ID } from "./appwrite";

export async function signUp(email: string, password: string, name: string) {
  await account.create(ID.unique(), email, password, name);
  return account.createEmailPasswordSession(email, password);
}

export const signIn = (email: string, password: string) =>
  account.createEmailPasswordSession(email, password);

export const signInWithGoogle = () =>
  account.createOAuth2Session(
    OAuthProvider.Google,
    window.location.origin + "/auth/callback",
    window.location.origin + "/login"
  );

export async function getUser() {
  try { return await account.get(); }
  catch { return null; }
}

export const signOut = () => account.deleteSession("current");