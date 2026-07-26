import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database.types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AuthUser = {
  /** Supabase Auth UUID */
  authId: string;
  /** public.users primary key */
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Core helper: fetch authenticated user + their role from public.users
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the fully-resolved auth user (with role) or null if unauthenticated.
 * Uses getUser() — never getSession() — to avoid trusting the client cookie alone.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, role, avatar_url")
    .eq("auth_id", user.id)
    .single();

  const role =
    (profile as { role?: UserRole } | null)?.role ||
    (user.user_metadata?.role as UserRole) ||
    "donor";

  return {
    authId: user.id,
    id: (profile as { id?: string } | null)?.id || user.id,
    email: (profile as { email?: string } | null)?.email || user.email || "",
    fullName:
      (profile as { full_name?: string } | null)?.full_name ||
      (user.user_metadata?.full_name as string) ||
      "Donor",
    role,
    avatarUrl: (profile as { avatar_url?: string | null } | null)?.avatar_url || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Role checks (pure, synchronous)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true if the given role is 'admin'. */
export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

/** Returns true if the given role is 'donor'. */
export function isDonor(role: UserRole): boolean {
  return role === "donor";
}

/** Returns true if the user has at least one of the required roles. */
export function hasRole(role: UserRole, ...allowed: UserRole[]): boolean {
  return allowed.includes(role);
}

// ─────────────────────────────────────────────────────────────────────────────
// Server-side route guards (redirect on failure)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Requires any authenticated user.
 * Redirects to /login if unauthenticated.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  return user!;
}

/**
 * Requires the authenticated user to have the ADMIN role.
 * - Unauthenticated → /admin/login
 * - Authenticated but non-admin → /dashboard  (access denied)
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdmin(user!.role)) {
    // Donor / other role — send them to their own dashboard
    redirect("/donor/dashboard");
  }

  return user!;
}

/**
 * Requires the authenticated user to have the DONOR role.
 * - Unauthenticated → /login
 * - Authenticated admin → /admin/dashboard  (admins have their own space)
 */
export async function requireDonor(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (isAdmin(user!.role)) {
    // Admin accidentally landed on donor area → push to admin dashboard
    redirect("/admin/dashboard");
  }

  return user!;
}

/**
 * Requires the user to have at least one of the supplied roles.
 * Redirects to /unauthorized on failure.
 */
export async function requireAnyRole(
  ...roles: UserRole[]
): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasRole(user!.role, ...roles)) {
    redirect("/unauthorized");
  }

  return user!;
}
