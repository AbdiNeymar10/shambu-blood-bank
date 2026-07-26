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
 * Handles Donor Login using Supabase Auth
 */
export async function loginDonor(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email address and password are required." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Failed to authenticate user. Please try again." };
    }

    // Fetch user role from public.users table (fallback to metadata)
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", data.user.id)
      .single();

    const role =
      (userData as { role: UserRole } | null)?.role ||
      (data.user.user_metadata?.role as UserRole) ||
      "donor";

    const targetRoute = role === "admin" ? "/admin/dashboard" : "/donor/dashboard";

    return { success: true, redirectTo: targetRoute };
  } catch (err: any) {
    console.error("Supabase Login Error:", err);
    return {
      error: err?.message || "An unexpected error occurred during sign in.",
    };
  }
}

/**
 * Handles Dedicated Admin Login using Supabase Auth
 */
export async function loginAdmin(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email address and password are required." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Failed to authenticate user." };
    }

    // Verify that the user has admin role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", data.user.id)
      .single();

    const role =
      (userData as { role: UserRole } | null)?.role ||
      (data.user.user_metadata?.role as UserRole);

    if (role !== "admin") {
      await supabase.auth.signOut();
      return {
        error: "Access denied. Only administrator accounts can access this portal.",
      };
    }

    return { success: true, redirectTo: "/admin/dashboard" };
  } catch (err: any) {
    console.error("Supabase Admin Login Error:", err);
    return {
      error: err?.message || "An unexpected error occurred during admin sign in.",
    };
  }
}

/**
 * Handles Donor Registration using Supabase Auth & PostgreSQL Tables
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
    return { error: "Please fill out all required fields marked with *." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 1. Sign up user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: "donor",
        },
      },
    });

    let user = data.user;

    if (error) {
      // If email rate limit is hit, attempt to sign in directly if account exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!signInError && signInData.user) {
        user = signInData.user;
      } else {
        if (error.message.toLowerCase().includes("rate limit")) {
          return {
            error:
              "Email rate limit reached.",
          };
        }
        return { error: error.message };
      }
    }

    if (user) {
      // 2. Ensure public.users entry exists
      let { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      let userId = (existingUser as { id: string } | null)?.id;

      if (!userId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newUser } = await (supabase as any)
          .from("users")
          .insert([
            {
              auth_id: user.id,
              email: email.trim(),
              full_name: fullName,
              phone: phone || null,
              role: "donor" as UserRole,
            },
          ])
          .select("id")
          .single();

        userId = (newUser as { id: string } | null)?.id;
      }

      // 3. Create or update public.donor_profiles entry
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("donor_profiles")
          .upsert(
            [
              {
                user_id: userId,
                blood_group: bloodGroup,
                date_of_birth: dateOfBirth,
                address: address || null,
                city,
                is_available: true,
              },
            ],
            { onConflict: "user_id" }
          );
      }
    }

    // Sign out active session created during registration so user signs in manually on /login
    await supabase.auth.signOut();

    return {
      success: true,
      message: "Registration successful! Please sign in with your credentials to access your dashboard.",
      redirectTo: "/login?registered=true",
    };
  } catch (err: any) {
    console.error("Supabase Register Error:", err);
    return {
      error: err?.message || "An unexpected error occurred during registration.",
    };
  }
}

/**
 * Handles Requesting Password Reset Email via Supabase
 */
export async function forgotPassword(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your registered email address." };
  }

  try {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success: true,
      message: "Password reset link sent! Check your email inbox.",
    };
  } catch (err: any) {
    console.error("Supabase Forgot Password Error:", err);
    return {
      error: err?.message || "An unexpected error occurred.",
    };
  }
}

/**
 * Handles Updating Password via Supabase after Reset Link Click
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

  try {
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
  } catch (err: any) {
    console.error("Supabase Reset Password Error:", err);
    return {
      error: err?.message || "An unexpected error occurred while resetting password.",
    };
  }
}

/**
 * Signs Out Current User via Supabase Auth
 */
export async function logout(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Logout Error:", err);
  }
  redirect("/login");
}
