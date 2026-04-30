"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "Understanding Blood Types: A Comprehensive Guide",
    excerpt: "Learn the science behind ABO and Rh blood groups and why compatibility matters in transfusions.",
    category: "Education",
    date: "Oct 10, 2026",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 2,
    title: "How to Prepare for Your First Blood Donation",
    excerpt: "Everything you need to know, eat, and do before, during, and after donating blood for the first time.",
    category: "Guides",
    date: "Oct 05, 2026",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 3,
    title: "The Critical Shortage of O-Negative Blood",
    excerpt: "Why the universal donor type is always in high demand and how you can help alleviate the shortage.",
    category: "News",
    date: "Sep 28, 2026",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600&h=400",
  },
];

export function BlogPreview() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 font-medium text-sm mb-6"
            >
              <BookOpen size={16} className="mr-2" />
              Awareness & Education
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            >
              Latest Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Stay informed with our latest articles on health, donation tips, and community impact.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="outline" className="rounded-full group">
              Read the Blog
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col"
            >
              <div className="relative h-56 rounded-3xl overflow-hidden mb-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-background/90 backdrop-blur-sm text-foreground">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <time>{article.date}</time>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                <Link href="#">{article.title}</Link>
              </h3>
              <p className="text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
