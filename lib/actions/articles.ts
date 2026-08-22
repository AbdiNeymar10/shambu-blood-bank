"use server";

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
};

/**
 * Fetches all blog posts for the Admin Blog Management page from Supabase.
 */
export async function getAdminArticlesData(): Promise<AdminArticleItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, category, is_published, published_at, created_at, updated_at, author_id, users(full_name)")
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

    const { error: insertErr } = await supabase.from("blog_posts").insert({
      title,
      slug,
      category,
      content,
      excerpt: input.excerpt || title,
      is_published: isPublished,
      published_at: publishedAt,
    });

    if (insertErr) {
      console.error("Error creating article:", insertErr);
      return { success: false, error: "Failed to create article record." };
    }

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

    const { error: updateErr } = await supabase
      .from("blog_posts")
      .update({
        title,
        category,
        content,
        excerpt: input.excerpt || title,
        is_published: isPublished,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateErr) {
      console.error("Error updating article:", updateErr);
      return { success: false, error: "Failed to update article." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateAdminArticle:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
