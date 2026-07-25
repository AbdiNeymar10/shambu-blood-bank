"use client";

import { 
  Newspaper, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";

const ARTICLES = [
  { id: "blog-1", title: "Why Regular Blood Donation Saves Up to 3 Lives", category: "Health & Education", author: "Dr. Abera Mengistu", publishDate: "2026-07-10", status: "Published", views: 1420 },
  { id: "blog-2", title: "Preparing for Your First Blood Donation: What to Expect", category: "Donor Tips", author: "Sister Hannah Desta", publishDate: "2026-07-15", status: "Published", views: 980 },
  { id: "blog-3", title: "Myth Busting: Blood Donation and Physical Recovery in Athletes", category: "Sports & Health", author: "Dr. Abera Mengistu", publishDate: "2026-07-22", status: "Draft", views: 0 },
  { id: "blog-4", title: "Shambu Community Responds to Emergency Blood Appeal", category: "Community News", author: "Admin Team", publishDate: "2026-06-28", status: "Published", views: 2310 },
];

export default function AdminBlogPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blog & Educational Content</h1>
          <p className="text-muted-foreground font-medium">Publish educational articles, health awareness guides, and community announcements.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Create New Article
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Published & Draft Articles</h3>
          <span className="text-xs font-semibold text-muted-foreground">Showing 4 Articles</span>
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
              {ARTICLES.map((article) => (
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
                    <button className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> Edit Article
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
