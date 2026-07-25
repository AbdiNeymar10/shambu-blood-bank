import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Gets the current authenticated user on the server.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Gets the active user session on the server.
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}

/**
 * Requires an authenticated user. Redirects to login page if unauthenticated.
 */
export async function requireAuth(redirectTo: string = "/login") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}
