"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export type AdminArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  status: "Published" | "Draft";
  views: number;
  isPublished: boolean;
  coverImageUrl?: string;
  images: string[];
};

export type PublicArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  coverImageUrl: string;
  images: string[];
};

/**
 * Parses single or multiple picture URLs from cover_image_url field.
 */
function parseImageUrls(rawUrl?: string | null): { coverImageUrl: string; images: string[] } {
  const defaultImg = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop";
  if (!rawUrl || !rawUrl.trim()) {
    return { coverImageUrl: defaultImg, images: [defaultImg] };
  }

  const str = rawUrl.trim();
  if (str.startsWith("[") && str.endsWith("]")) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const validImgs = parsed.map((s: string) => String(s).trim()).filter(Boolean);
        if (validImgs.length > 0) {
          return { coverImageUrl: validImgs[0], images: validImgs };
        }
      }
    } catch {}
  }

  if (str.includes("|||")) {
    const parts = str.split("|||").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) {
      return { coverImageUrl: parts[0], images: parts };
    }
  }

  return { coverImageUrl: str, images: [str] };
}

/**
 * Encodes an array of picture URLs for storage in cover_image_url.
 */
function encodeImageUrls(images?: string[], primaryCover?: string): string {
  const list: string[] = [];

  if (primaryCover && primaryCover.trim()) {
    list.push(primaryCover.trim());
  }

  if (Array.isArray(images)) {
    images.forEach((img) => {
      const trimmed = img ? img.trim() : "";
      if (trimmed && !list.includes(trimmed)) {
        list.push(trimmed);
      }
    });
  }

  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  return JSON.stringify(list);
}

/**
 * Fetches all blog posts for the Admin Blog Management page from Supabase.
 */
export async function getAdminArticlesData(): Promise<AdminArticleItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, category, cover_image_url, is_published, published_at, created_at, updated_at, author_id, users(full_name)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching blog posts:", error);
      return [];
    }

    return data.map((row: any) => {
      const user = Array.isArray(row.users) ? row.users[0] : row.users;
      const authorName = user?.full_name || "Admin Team";

      const dateSource = row.published_at || row.created_at;
      const publishDate = dateSource ? dateSource.split("T")[0] : "Draft";
      const status: "Published" | "Draft" = row.is_published ? "Published" : "Draft";

      const { coverImageUrl, images } = parseImageUrls(row.cover_image_url);

      return {
        id: row.id,
        title: row.title || "Untitled Article",
        slug: row.slug || "",
        excerpt: row.excerpt || "",
        content: row.content || "",
        category: row.category || "Health & Education",
        author: authorName,
        publishDate,
        status,
        views: 0,
        isPublished: !!row.is_published,
        coverImageUrl,
        images,
      };
    });
  } catch (err) {
    console.error("Unexpected error in getAdminArticlesData:", err);
    return [];
  }
}

/**
 * Creates a new blog post in Supabase using createAdminClient.
 */
export async function createAdminArticle(input: {
  title: string;
  category: string;
  content: string;
  excerpt?: string;
  status: "Published" | "Draft";
  coverImageUrl?: string;
  images?: string[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const title = (input.title || "").trim();
    const category = (input.category || "Health & Education").trim();
    const content = (input.content || "").trim();

    if (!title || !content) {
      return { success: false, error: "Article title and content are required." };
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const isPublished = input.status === "Published";
    const publishedAt = isPublished ? new Date().toISOString() : null;

    const encodedImages = encodeImageUrls(input.images, input.coverImageUrl);

    const { error: insertErr } = await supabase.from("blog_posts").insert({
      title,
      slug,
      category,
      content,
      excerpt: input.excerpt || title,
      cover_image_url: encodedImages || null,
      is_published: isPublished,
      published_at: publishedAt,
    });

    if (insertErr) {
      console.error("Error creating article:", insertErr);
      return { success: false, error: "Failed to create article record." };
    }

    try {
      revalidatePath("/admin/blog");
      revalidatePath("/blog");
    } catch {}

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in createAdminArticle:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Updates an existing blog post in Supabase.
 */
export async function updateAdminArticle(
  articleId: string,
  input: {
    title: string;
    category: string;
    content: string;
    excerpt?: string;
    status: "Published" | "Draft";
    coverImageUrl?: string;
    images?: string[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const title = (input.title || "").trim();
    const category = (input.category || "Health & Education").trim();
    const content = (input.content || "").trim();

    if (!title || !content) {
      return { success: false, error: "Article title and content are required." };
    }

    const isPublished = input.status === "Published";
    const publishedAt = isPublished ? new Date().toISOString() : null;

    const encodedImages = encodeImageUrls(input.images, input.coverImageUrl);

    const { error: updateErr } = await supabase
      .from("blog_posts")
      .update({
        title,
        category,
        content,
        excerpt: input.excerpt || title,
        cover_image_url: encodedImages || null,
        is_published: isPublished,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateErr) {
      console.error("Error updating article:", updateErr);
      return { success: false, error: "Failed to update article." };
    }

    try {
      revalidatePath("/admin/blog");
      revalidatePath("/blog");
    } catch {}

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateAdminArticle:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// ---------------------------------------------------------------------------
// Public Blog Actions
// ---------------------------------------------------------------------------

function calculateReadTime(content: string): string {
  const words = content ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Fetches all published articles for public blog pages.
 */
export async function getPublicBlogPosts(): Promise<PublicArticleItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let supabase: any;
    try {
      supabase = (await createClient()) as any;
    } catch {
      supabase = createAdminClient() as any;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, category, cover_image_url, published_at, created_at, users(full_name)")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => {
      const user = Array.isArray(row.users) ? row.users[0] : row.users;
      const authorName = user?.full_name || "Shambu Medical Team";
      const dateStr = row.published_at || row.created_at;
      const publishDate = dateStr
        ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Recent";

      const { coverImageUrl, images } = parseImageUrls(row.cover_image_url);

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt || row.title,
        content: row.content || "",
        category: row.category || "Health & Education",
        author: authorName,
        publishDate,
        readTime: calculateReadTime(row.content || ""),
        coverImageUrl,
        images,
      };
    });
  } catch (err) {
    console.error("Error fetching public blog posts:", err);
    return [];
  }
}

/**
 * Fetches a single published blog post by its slug.
 */
export async function getPublicBlogPostBySlug(slug: string): Promise<PublicArticleItem | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let supabase: any;
    try {
      supabase = (await createClient()) as any;
    } catch {
      supabase = createAdminClient() as any;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, category, cover_image_url, published_at, created_at, users(full_name)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) return null;

    const user = Array.isArray(data.users) ? data.users[0] : data.users;
    const authorName = user?.full_name || "Shambu Medical Team";
    const dateStr = data.published_at || data.created_at;
    const publishDate = dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Recent";

    const { coverImageUrl, images } = parseImageUrls(data.cover_image_url);

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || data.title,
      content: data.content || "",
      category: data.category || "Health & Education",
      author: authorName,
      publishDate,
      readTime: calculateReadTime(data.content || ""),
      coverImageUrl,
      images,
    };
  } catch (err) {
    console.error("Error fetching public blog post by slug:", err);
    return null;
  }
}
