"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BloodGroup, UserRole } from "@/types/database.types";

export type AuthActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
  redirectTo?: string;
};

/**
 * Handles Donor Login
 */
export async function loginDonor(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch user role from public.users table
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("auth_id", data.user.id)
    .single();

  const role = (userData as { role: UserRole } | null)?.role ?? "donor";
  const targetRoute = role === "admin" ? "/admin" : "/dashboard";

  return { success: true, redirectTo: targetRoute };
}

/**
 * Handles Dedicated Admin Login
 */
export async function loginAdmin(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Verify that the user has admin role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("auth_id", data.user.id)
    .single();

  if ((userData as { role: UserRole } | null)?.role !== "admin") {
    await supabase.auth.signOut();
    return {
      error: "Access denied. Only administrator accounts can access this portal.",
    };
  }

  return { success: true, redirectTo: "/admin" };
}

/**
 * Handles Donor Registration
 */
export async function registerDonor(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const bloodGroup = formData.get("bloodGroup") as BloodGroup;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const city = (formData.get("city") as string) || "Shambu";
  const address = formData.get("address") as string;

  if (!fullName || !email || !password || !bloodGroup || !dateOfBirth) {
    return { error: "Please fill out all required fields." };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        role: "donor",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Check or insert public.users row
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", data.user.id)
      .single();

    let userId = (existingUser as { id: string } | null)?.id;

    if (!userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newUser } = await (supabase as any)
        .from("users")
        .insert([
          {
            auth_id: data.user.id as string,
            email,
            full_name: fullName,
            phone,
            role: "donor" as UserRole,
          },
        ])
        .select("id")
        .single();
      userId = (newUser as { id: string } | null)?.id;
    }

    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("donor_profiles")
        .upsert(
          [
            {
              user_id: userId as string,
              blood_group: bloodGroup,
              date_of_birth: dateOfBirth,
              address,
              city,
              is_available: true,
            },
          ],
          { onConflict: "user_id" }
        );
    }
  }

  return {
    success: true,
    message: "Registration successful! Please check your email to verify your account.",
    redirectTo: "/verify-email",
  };
}

/**
 * Handles Requesting Password Reset Email
 */
export async function forgotPassword(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your registered email address." };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "Password reset link sent! Check your email inbox.",
  };
}

/**
 * Handles Updating Password after Reset Link Click
 */
export async function resetPassword(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "Password successfully updated! You can now log in.",
    redirectTo: "/login",
  };
}

/**
 * Signs Out Current User
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
