import { redirect } from "next/navigation";
import { createClient } from "./server";
export {
  getAuthUser,
  isAdmin,
  isDonor,
  hasRole,
  requireAuth,
  requireAdmin,
  requireDonor,
  requireAnyRole,
  type AuthUser,
} from "@/lib/rbac";

/**
 * Gets the current authenticated Supabase auth user on the server.
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
