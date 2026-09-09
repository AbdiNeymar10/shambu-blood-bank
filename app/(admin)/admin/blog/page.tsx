"use client";

import { useState, useEffect, useRef } from "react";
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
  Image as ImageIcon,
  Link as LinkIcon,
  UploadCloud,
  Upload,
  Star,
  Trash2
} from "lucide-react";
import { 
  getAdminArticlesData, 
  createAdminArticle, 
  updateAdminArticle,
  uploadArticleImage,
  type AdminArticleItem 
} from "@/lib/actions/articles";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  "Health & Education",
  "Donor Tips",
  "Sports & Health",
  "Community News"
];

const PRESET_IMAGES = [
  { label: "Blood Bag & Hospital", url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=600" },
  { label: "Donor Giving Blood", url: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&q=80&w=600" },
  { label: "Healthcare Doctor", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600" },
  { label: "Community Outreach", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600" },
];

/**
 * Resizes and compresses image files on the client before converting to Base64 data URL fallback.
 */
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<AdminArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // File Inputs Refs
  const createFileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Image Uploading & Drag State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Create Article Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    title: string;
    category: string;
    excerpt: string;
    content: string;
    coverImageUrl: string;
    images: string[];
    status: "Published" | "Draft";
  }>({
    title: "",
    category: "Health & Education",
    excerpt: "",
    content: "",
    coverImageUrl: PRESET_IMAGES[0].url,
    images: [PRESET_IMAGES[0].url],
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
    coverImageUrl: string;
    images: string[];
    status: "Published" | "Draft";
  }>({
    title: "",
    category: "Health & Education",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    images: [],
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

  const handleAddImage = (isEdit: boolean, urlToAdd = "") => {
    if (isEdit) {
      setEditForm((prev) => {
        const nextImgs = [...prev.images, urlToAdd];
        return { ...prev, images: nextImgs, coverImageUrl: prev.coverImageUrl || urlToAdd };
      });
    } else {
      setCreateForm((prev) => {
        const nextImgs = [...prev.images, urlToAdd];
        return { ...prev, images: nextImgs, coverImageUrl: prev.coverImageUrl || urlToAdd };
      });
    }
  };

  const handleRemoveImage = (isEdit: boolean, index: number) => {
    if (isEdit) {
      setEditForm((prev) => {
        const next = [...prev.images];
        next.splice(index, 1);
        return { ...prev, images: next, coverImageUrl: next[0] || "" };
      });
    } else {
      setCreateForm((prev) => {
        const next = [...prev.images];
        next.splice(index, 1);
        return { ...prev, images: next, coverImageUrl: next[0] || "" };
      });
    }
  };

  const handleSetCoverImage = (isEdit: boolean, index: number) => {
    if (isEdit) {
      setEditForm((prev) => {
        if (index <= 0 || index >= prev.images.length) return prev;
        const next = [...prev.images];
        const selected = next.splice(index, 1)[0];
        next.unshift(selected);
        return { ...prev, images: next, coverImageUrl: selected };
      });
    } else {
      setCreateForm((prev) => {
        if (index <= 0 || index >= prev.images.length) return prev;
        const next = [...prev.images];
        const selected = next.splice(index, 1)[0];
        next.unshift(selected);
        return { ...prev, images: next, coverImageUrl: selected };
      });
    }
  };

  const handleImageChange = (isEdit: boolean, index: number, value: string) => {
    if (isEdit) {
      setEditForm((prev) => {
        const next = [...prev.images];
        next[index] = value;
        return { ...prev, images: next, coverImageUrl: next[0] || value };
      });
    } else {
      setCreateForm((prev) => {
        const next = [...prev.images];
        next[index] = value;
        return { ...prev, images: next, coverImageUrl: next[0] || value };
      });
    }
  };

  // Handles uploading files chosen from File Explorer / Gallery
  const handleFileSelected = async (files: FileList | File[] | null, isEdit: boolean) => {
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      let uploadedUrl = "";
      // 1. Try Supabase Storage upload
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadArticleImage(formData);
        if (res.success && res.url) {
          uploadedUrl = res.url;
        }
      } catch (err) {
        console.warn("Storage upload failed, falling back to base64", err);
      }

      // 2. Fallback to compressed Base64 data URL
      if (!uploadedUrl) {
        try {
          uploadedUrl = await compressImageFile(file);
        } catch (e) {
          console.error("Failed to compress image file", e);
        }
      }

      if (uploadedUrl) {
        newUrls.push(uploadedUrl);
      }
    }

    if (newUrls.length > 0) {
      if (isEdit) {
        setEditForm((prev) => {
          const cleaned = prev.images.filter((img) => img.trim().length > 0);
          const combined = [...cleaned, ...newUrls];
          return {
            ...prev,
            images: combined,
            coverImageUrl: prev.coverImageUrl || combined[0],
          };
        });
      } else {
        setCreateForm((prev) => {
          const cleaned = prev.images.filter((img) => img.trim().length > 0);
          const combined = [...cleaned, ...newUrls];
          return {
            ...prev,
            images: combined,
            coverImageUrl: prev.coverImageUrl || combined[0],
          };
        });
      }
    }

    setIsUploadingImage(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.content.trim()) {
      setCreateError("Please enter article title and content.");
      return;
    }

    setIsCreateSubmitting(true);
    setCreateError("");

    const validImages = createForm.images.filter((img) => img.trim().length > 0);
    const primaryCover = validImages[0] || createForm.coverImageUrl || PRESET_IMAGES[0].url;

    const res = await createAdminArticle({
      ...createForm,
      coverImageUrl: primaryCover,
      images: validImages.length > 0 ? validImages : [primaryCover],
    });
    setIsCreateSubmitting(false);

    if (res.success) {
      setIsCreateModalOpen(false);
      setCreateForm({
        title: "",
        category: "Health & Education",
        excerpt: "",
        content: "",
        coverImageUrl: PRESET_IMAGES[0].url,
        images: [PRESET_IMAGES[0].url],
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
    const articleImages =
      article.images && article.images.length > 0
        ? article.images
        : article.coverImageUrl
        ? [article.coverImageUrl]
        : [PRESET_IMAGES[0].url];

    setEditForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      coverImageUrl: article.coverImageUrl || articleImages[0] || "",
      images: articleImages,
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

    const validImages = editForm.images.filter((img) => img.trim().length > 0);
    const primaryCover = validImages[0] || editForm.coverImageUrl || PRESET_IMAGES[0].url;

    const res = await updateAdminArticle(editingArticle.id, {
      ...editForm,
      coverImageUrl: primaryCover,
      images: validImages.length > 0 ? validImages : [primaryCover],
    });
    setIsEditSubmitting(false);

    if (res.success) {
      setEditingArticle(null);
      loadData();
    } else {
      setEditError(res.error || "Failed to update article.");
    }
  };

  /**
   * Renders the complete Image Picker & Gallery Management component for Modals
   */
  const renderImagePickerSection = (isEdit: boolean) => {
    const imagesList = isEdit ? editForm.images : createForm.images;
    const fileInputRef = isEdit ? editFileInputRef : createFileInputRef;

    return (
      <div className="space-y-4 p-4 bg-secondary/30 rounded-2xl border border-border">
        {/* Hidden File Input */}
        <input 
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFileSelected(e.target.files, isEdit);
            e.target.value = "";
          }}
        />

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Article Pictures & Gallery ({imagesList.length})
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add multiple photos from your device gallery or computer. The 1st photo is used as the cover.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all shrink-0 active:scale-95 disabled:opacity-50"
            >
              {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Upload from File / Gallery
            </button>
            <button
              type="button"
              onClick={() => handleAddImage(isEdit, "")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-secondary text-foreground hover:bg-secondary/80 text-xs font-semibold rounded-xl border border-border transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> URL
            </button>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
              handleFileSelected(e.dataTransfer.files, isEdit);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-border/80 hover:border-primary/50 bg-background/50"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-xs font-bold text-foreground">Choose image files from your computer or gallery</span>
            <span className="text-[11px] text-muted-foreground block">Select JPG, PNG, WebP photos or drag & drop files here</span>
          </div>
        </div>

        {/* Image List / Cards */}
        {imagesList.length > 0 && (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {imagesList.map((imgUrl, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border shadow-sm">
                <div className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-secondary shrink-0 flex items-center justify-center relative group">
                  {imgUrl ? (
                    <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-primary text-[7px] font-extrabold text-primary-foreground text-center py-0.5 uppercase tracking-wider">
                      Cover
                    </span>
                  )}
                </div>
                <div className="relative flex-1 min-w-0">
                  <LinkIcon className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(isEdit, idx, e.target.value)}
                    placeholder={idx === 0 ? "Main Cover Photo..." : `Gallery Photo #${idx + 1}...`}
                    className="w-full h-9 pl-8 pr-2 rounded-lg border border-input bg-background text-xs outline-none focus:ring-1 focus:ring-primary truncate"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCoverImage(isEdit, idx)}
                      className="px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1"
                      title="Make this photo the main cover"
                    >
                      <Star className="w-3 h-3" /> Make Cover
                    </button>
                  )}
                  {imagesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(isEdit, idx)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remove Picture"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preset Gallery Choices */}
        <div className="pt-2 border-t border-border/60">
          <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Quick Stock Photos:</span>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddImage(isEdit, preset.url)}
                className="relative rounded-lg overflow-hidden border border-border h-11 hover:border-primary transition-all group"
              >
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute inset-0 bg-black/50 text-[9px] font-bold text-white flex items-center justify-center p-1 text-center line-clamp-2">
                  + {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
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
                <th className="px-6 py-4">Article</th>
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
                      <div className="flex items-center gap-3">
                        {article.coverImageUrl ? (
                          <img 
                            src={article.coverImageUrl} 
                            alt={article.title}
                            className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-foreground line-clamp-1 flex items-center gap-2">
                            <span>{article.title}</span>
                            {article.images && article.images.length > 1 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <ImageIcon className="w-3 h-3" /> {article.images.length} Photos
                              </span>
                            )}
                          </div>
                          {article.excerpt && (
                            <div className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</div>
                          )}
                        </div>
                      </div>
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
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-5 relative max-h-[90vh] overflow-y-auto">
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

              {/* Multiple Pictures & Gallery Section */}
              {renderImagePickerSection(false)}

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
                  rows={4}
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
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-5 relative max-h-[90vh] overflow-y-auto">
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

              {/* Multiple Pictures & Gallery Section */}
              {renderImagePickerSection(true)}

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
                  rows={4}
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
