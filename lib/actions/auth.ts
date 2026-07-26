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
      .maybeSingle();

    const role =
      (userData as { role: UserRole } | null)?.role ||
      (data.user.user_metadata?.role as UserRole);

    if (role !== "admin") {
      await supabase.auth.signOut();
      return {
        error: "Access denied. Only administrator accounts can access this portal.",
      };
    }

    // Keep metadata in sync with database role
    await supabase.auth.updateUser({
      data: { role: "admin" },
    });

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

    console.log("[register] step1: calling signUp for", email.trim());

    // 1. Sign up user via Supabase Auth (the handle_new_user DB trigger will
    //    automatically create the public.users row via SECURITY DEFINER)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
          role: "donor",
        },
      },
    });

    console.log("[register] step1 FULL result:", JSON.stringify({ user: data?.user, session: !!data?.session, error }));

    let user = data.user;

    if (error) {
      // signUp failed — could be duplicate email, rate limit, or empty error {}
      // Always try signing in directly (handles "already registered" case)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!signInError && signInData.user) {
        user = signInData.user;
        console.log("[register] step1 fallback signIn success, user=", user.id);
      } else {
        // Return the most descriptive error we can build
        const errMsg = error?.message || error?.code || "";
        if (errMsg.toLowerCase().includes("rate limit")) {
          return { error: "Email rate limit reached. Please wait a moment and try again." };
        }
        if (errMsg) {
          return { error: errMsg };
        }
        // Empty error {} — most likely the email already exists but wrong password
        return {
          error: "Registration failed. This email may already be registered with a different password, or the service is temporarily unavailable.",
        };
      }
    }

    if (user) {
      // 2. Wait for the handle_new_user trigger to create the public.users row.
      //    The trigger fires on auth.users INSERT but may have slight latency —
      //    retry up to 3 times with an 800ms pause before each retry.
      let userId: string | undefined;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
        console.log("[register] step2: looking up users row, attempt", attempt + 1);
        const { data: existingUser, error: lookupErr } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", user.id)
          .maybeSingle();

        console.log("[register] step2 result:", existingUser, "lookupErr:", lookupErr?.message);

        if (existingUser) {
          userId = (existingUser as { id: string }).id;
          break;
        }
      }

      console.log("[register] step2 final userId:", userId);

      // Update phone / full_name after trigger created the row
      if (userId && phone) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("users")
          .update({ phone, full_name: fullName })
          .eq("id", userId);
      }

      // Fallback: if trigger hasn't fired, insert directly (requires INSERT policy or service role)
      if (!userId) {
        console.log("[register] step2 fallback: attempting manual upsert");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newUser, error: userError } = await (supabase as any)
          .from("users")
          .upsert(
            [
              {
                auth_id: user.id,
                email: email.trim(),
                full_name: fullName,
                phone: phone || null,
                role: "donor" as UserRole,
              },
            ],
            { onConflict: "auth_id" }
          )
          .select("id")
          .maybeSingle();

        console.log("[register] step2 fallback result:", newUser, "error:", userError?.message);

        if (userError) {
          console.error("User profile upsert error (fallback):", userError);
          // Non-fatal — donor_profiles can be populated on first login
        } else {
          userId = (newUser as { id: string } | null)?.id;
        }
      }

      // 3. Create or update public.donor_profiles entry
      console.log("[register] step3: upserting donor_profiles, userId=", userId);
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: profileError } = await (supabase as any)
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

        console.log("[register] step3 result: profileError=", profileError?.message);

        if (profileError) {
          console.error("Donor profile upsert error:", profileError);
          return { error: profileError.message || profileError.details || "Failed to save donor profile details." };
        }
      }
    }

    // Sign out the session created during registration so the user must sign in manually
    await supabase.auth.signOut();

    console.log("[register] complete — success!");

    return {
      success: true,
      message: "Registration successful! Please sign in with your credentials to access your dashboard.",
      redirectTo: "/login?registered=true",
    };
  } catch (err: any) {
    console.error("Supabase Register Error:", err);
    const rawMsg =
      typeof err === "string"
        ? err
        : err?.message || err?.error_description || (typeof err === "object" ? JSON.stringify(err) : "");
    const cleanError =
      !rawMsg || rawMsg === "{}"
        ? "An unexpected error occurred during registration. Please check your details and try again."
        : rawMsg;
    return { error: cleanError };
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

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
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
      if (error.message.toLowerCase().includes("session")) {
        return {
          error:
            "Password reset link is invalid or has expired. Please request a new password reset link.",
        };
      }
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
