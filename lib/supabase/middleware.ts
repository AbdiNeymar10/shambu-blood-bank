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

  if (user) {
    // Fetch user role from database
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    const role = (profile as { role?: string } | null)?.role || "donor";

    // 1. If logged in user tries to access guest auth pages, redirect to dashboard
    if (isAuthGuestRoute) {
      url.pathname = role === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }

    // 2. If non-admin tries to access admin routes
    if (isAdminRoute && role !== "admin") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } else {
    // 3. Unauthenticated guest trying to access protected admin routes
    if (isAdminRoute) {
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // 4. Unauthenticated guest trying to access protected donor dashboard
    if (isDashboardRoute) {
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
