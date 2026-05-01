import { FeaturedArticle, ArticleGrid } from "@/components/blog";

export const metadata = {
  title: "Blog & Awareness | Shambu Blood Bank",
  description: "Read our latest articles on blood donation, health tips, medical advancements, and community stories.",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-32 pb-8 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Insights & <span className="text-primary">Stories</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest updates from the world of blood donation, health tips, and inspiring donor stories.
          </p>
        </div>
      </section>

      <FeaturedArticle />
      <ArticleGrid />
    </div>
  );
}
