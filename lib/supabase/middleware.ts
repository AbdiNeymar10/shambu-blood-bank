import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

/**
 * Updates Supabase auth session and enforces role-based access control (RBAC).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Define route categories
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminLoginRoute = pathname === "/admin/login";
  const isDashboardRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/donor");
  const isAuthGuestRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login" ||
    pathname === "/forgot-password";

  // Helper to ensure refreshed cookies are preserved on redirect responses
  function redirectWithCookies(targetUrl: URL) {
    if (targetUrl.pathname === request.nextUrl.pathname) {
      return supabaseResponse;
    }
    const redirectResponse = NextResponse.redirect(targetUrl);
    supabaseResponse.cookies.getAll().forEach((cookie: { name: string; value: string }) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", user.id)
      .maybeSingle();

    const role =
      (profile as { role?: string } | null)?.role ||
      (user.user_metadata?.role as string | undefined) ||
      "donor";

    // 1. If logged in user tries to access guest auth pages, redirect to appropriate dashboard directly
    if (isAuthGuestRoute) {
      url.pathname = role === "admin" ? "/admin/dashboard" : "/donor/dashboard";
      return redirectWithCookies(url);
    }

    // 2. If non-admin tries to access admin routes
    if (isAdminRoute && role !== "admin") {
      url.pathname = "/donor/dashboard";
      return redirectWithCookies(url);
    }
  } else {
    // 3. Unauthenticated guest trying to access protected admin routes
    if (isAdminRoute) {
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return redirectWithCookies(url);
    }

    // 4. Unauthenticated guest trying to access protected donor dashboard
    if (isDashboardRoute) {
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return redirectWithCookies(url);
    }
  }

  return supabaseResponse;
}
