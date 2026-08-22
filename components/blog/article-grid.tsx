"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Loader2, Newspaper } from "lucide-react";
import { getPublicBlogPosts, type PublicArticleItem } from "@/lib/actions/articles";

const CATEGORY_OPTIONS = [
  "All Categories",
  "Health & Education",
  "Donor Tips",
  "Sports & Health",
  "Community News",
];

export function ArticleGrid() {
  const [posts, setPosts] = useState<PublicArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      const data = await getPublicBlogPosts();
      setPosts(data);
      setIsLoading(false);
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === "All Categories") return true;
    return post.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section className="py-16 bg-muted/20">
      <div className="container px-4 md:px-6">
        
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold">Latest Articles</h2>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-4 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-sm font-medium">Loading published articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-3">
            <Newspaper className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No articles published yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Check back soon for new health guides, blood donation tips, and community news.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((article, idx) => (
              <motion.div
                key={article.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
              >
                <Link href={`/blog/${article.slug}`} className="block relative aspect-[3/2] overflow-hidden">
                  <img 
                    src={article.coverImageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-primary">
                    {article.category}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-medium">
                    <span>{article.publishDate}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>
                  
                  <Link href={`/blog/${article.slug}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                  </Link>
                  
                  <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <Link 
                    href={`/blog/${article.slug}`} 
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-auto"
                  >
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
