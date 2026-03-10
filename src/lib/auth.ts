import { OAuthProvider } from "appwrite";
import { account, ID } from "./appwrite";

// ── Sign Up ────────────────────────────────────────────────────────────────────
// Creates account, starts session, then sends verification email automatically.
export async function signUp(email: string, password: string, name: string) {
  try { await account.deleteSession("current"); } catch {}
  await account.create(ID.unique(), email, password, name);
  const session = await account.createEmailPasswordSession(email, password);
  // Send verification email — user lands on /verify-email after clicking link
  try {
    await account.createVerification(window.location.origin + "/verify-email");
  } catch (err) {
    console.warn("Could not send verification email:", err);
  }
  return session;
}

// ── Sign In ────────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  try { await account.deleteSession("current"); } catch {}
  return account.createEmailPasswordSession(email, password);
}

// ── Google OAuth ───────────────────────────────────────────────────────────────
export const signInWithGoogle = () =>
  account.createOAuth2Session(
    OAuthProvider.Google,
    window.location.origin + "/auth/callback",
    window.location.origin + "/login"
  );

// ── Get Current User ───────────────────────────────────────────────────────────
export async function getUser() {
  try { return await account.get(); }
  catch { return null; }
}

// ── Sign Out ───────────────────────────────────────────────────────────────────
export const signOut = () => account.deleteSession("current");

// ── Email Verification ─────────────────────────────────────────────────────────
// Call this to resend the verification email (e.g. from a "Resend" button).
export async function sendVerificationEmail() {
  return account.createVerification(window.location.origin + "/verify-email");
}

// Call this on the /verify-email page with the userId + secret from the URL params.
export async function confirmVerification(userId: string, secret: string) {
  return account.updateVerification(userId, secret);
}

// ── Password Reset ─────────────────────────────────────────────────────────────
// Step 1 — user enters email on ForgotPasswordPage, we send them a reset link.
export async function sendPasswordReset(email: string) {
  return account.createRecovery(email, window.location.origin + "/reset-password");
}

// Step 2 — user clicks link in email, lands on /reset-password with userId + secret
// in the URL. We call this with the new password.
export async function confirmPasswordReset(
  userId: string,
  secret: string,
  newPassword: string
) {
  return account.updateRecovery(userId, secret, newPassword);
}