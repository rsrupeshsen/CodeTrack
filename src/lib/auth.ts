import { OAuthProvider } from "appwrite";
import { account, ID } from "./appwrite";

// Sign up: create account, delete any stale session first, then create new session
export async function signUp(email: string, password: string, name: string) {
  // Delete any active session first to avoid "session is active" error
  try { await account.deleteSession("current"); } catch {}
  await account.create(ID.unique(), email, password, name);
  return account.createEmailPasswordSession(email, password);
}

// Sign in: delete stale session first, then create new one
export async function signIn(email: string, password: string) {
  try { await account.deleteSession("current"); } catch {}
  return account.createEmailPasswordSession(email, password);
}

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