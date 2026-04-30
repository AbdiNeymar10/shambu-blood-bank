"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const articles = [
  {
    slug: "iron-rich-foods-for-donors",
    title: "10 Iron-Rich Foods to Eat Before You Donate",
    excerpt: "Boost your hemoglobin levels naturally with these tasty and healthy meal suggestions.",
    category: "Nutrition",
    date: "Oct 10, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "the-journey-of-donated-blood",
    title: "From Vein to Vein: The Journey of Donated Blood",
    excerpt: "Ever wonder what happens after you leave the clinic? Follow the step-by-step process of testing and processing.",
    category: "Education",
    date: "Oct 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "overcoming-fear-of-needles",
    title: "Overcoming Trypanophobia (Fear of Needles)",
    excerpt: "Tips and tricks from our phlebotomists on how to stay calm and make your donation stress-free.",
    category: "Wellness",
    date: "Sep 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "rare-blood-types-explained",
    title: "Why Rare Blood Types Matter More Than Ever",
    excerpt: "If you have O- or a rare subtype, you possess a unique superpower. Here is why hospitals need you.",
    category: "Science",
    date: "Sep 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "donor-spotlight-sarah-j",
    title: "Donor Spotlight: Sarah's 100th Donation",
    excerpt: "Meet Sarah Jenkins, a local teacher who just hit an incredible milestone at our downtown center.",
    category: "Community",
    date: "Sep 02, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "platelet-vs-whole-blood",
    title: "Platelet vs. Whole Blood Donation",
    excerpt: "Understand the differences between donation types and find out which one is right for you.",
    category: "Education",
    date: "Aug 20, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?q=80&w=800&auto=format&fit=crop"
  }
];

export function ArticleGrid() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container px-4 md:px-6">
        
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold">Latest Articles</h2>
          <select className="h-10 px-4 rounded-md border border-input bg-background text-sm">
            <option>All Categories</option>
            <option>Education</option>
            <option>Nutrition</option>
            <option>Wellness</option>
            <option>Community</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
            >
              <Link href={`/blog/${article.slug}`} className="block relative aspect-[3/2] overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-primary">
                  {article.category}
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-medium">
                  <span>{article.date}</span>
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

      </div>
    </section>
  );
}
