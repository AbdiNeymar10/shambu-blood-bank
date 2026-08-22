"use client";

import { useState, useEffect } from "react";
import { 
  Newspaper, 
  Plus, 
  Calendar, 
  User, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock,
  Loader2,
  X,
  AlertTriangle,
  FileText
} from "lucide-react";
import { 
  getAdminArticlesData, 
  createAdminArticle, 
  updateAdminArticle,
  type AdminArticleItem 
} from "@/lib/actions/articles";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  "Health & Education",
  "Donor Tips",
  "Sports & Health",
  "Community News"
];

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<AdminArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Article Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    title: string;
    category: string;
    excerpt: string;
    content: string;
    status: "Published" | "Draft";
  }>({
    title: "",
    category: "Health & Education",
    excerpt: "",
    content: "",
    status: "Published",
  });
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit Article Modal State
  const [editingArticle, setEditingArticle] = useState<AdminArticleItem | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    category: string;
    excerpt: string;
    content: string;
    status: "Published" | "Draft";
  }>({
    title: "",
    category: "Health & Education",
    excerpt: "",
    content: "",
    status: "Published",
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    const data = await getAdminArticlesData();
    setArticles(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateError("");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.content.trim()) {
      setCreateError("Please enter article title and content.");
      return;
    }

    setIsCreateSubmitting(true);
    setCreateError("");

    const res = await createAdminArticle(createForm);
    setIsCreateSubmitting(false);

    if (res.success) {
      setIsCreateModalOpen(false);
      setCreateForm({
        title: "",
        category: "Health & Education",
        excerpt: "",
        content: "",
        status: "Published",
      });
      loadData();
    } else {
      setCreateError(res.error || "Failed to create article.");
    }
  };

  const handleOpenEditModal = (article: AdminArticleItem) => {
    setEditingArticle(article);
    setEditError("");
    setEditForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      status: article.status,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    if (!editForm.title.trim() || !editForm.content.trim()) {
      setEditError("Please enter article title and content.");
      return;
    }

    setIsEditSubmitting(true);
    setEditError("");

    const res = await updateAdminArticle(editingArticle.id, editForm);
    setIsEditSubmitting(false);

    if (res.success) {
      setEditingArticle(null);
      loadData();
    } else {
      setEditError(res.error || "Failed to update article.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blog & Educational Content</h1>
          <p className="text-muted-foreground font-medium">Publish educational articles, health awareness guides, and community announcements.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Article
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Published & Draft Articles</h3>
          <span className="text-xs font-semibold text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${articles.length} Articles`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Article Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Publish Date</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading articles...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No articles found. Click "Create New Article" to publish educational content.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm text-foreground">{article.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-foreground">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.publishDate}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-foreground">
                      <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-muted-foreground" /> {article.views}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                        article.status === "Published" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {article.status === "Published" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenEditModal(article)}
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Article
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Article Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Create New Article</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Article Title</label>
                <input 
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Why Regular Blood Donation Saves Lives"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publication Status</label>
                  <select 
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as "Published" | "Draft" })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Summary / Excerpt</label>
                <input 
                  type="text"
                  value={createForm.excerpt}
                  onChange={(e) => setCreateForm({ ...createForm, excerpt: e.target.value })}
                  placeholder="Brief summary of the article..."
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Article Content</label>
                <textarea 
                  rows={5}
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  placeholder="Write the article content here..."
                  className="w-full p-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreateSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isCreateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Edit Article</h3>
              <button 
                onClick={() => setEditingArticle(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Article Title</label>
                <input 
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publication Status</label>
                  <select 
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "Published" | "Draft" })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Summary / Excerpt</label>
                <input 
                  type="text"
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Article Content</label>
                <textarea 
                  rows={5}
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full p-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2.5 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isEditSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
