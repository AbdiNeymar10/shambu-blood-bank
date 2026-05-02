import { FeaturedArticle, ArticleGrid } from "@/components/blog";
import { PageHero } from "@/components/shared";

export const metadata = {
  title: "Blog & Awareness | Shambu Blood Bank",
  description: "Read our latest articles on blood donation, health tips, medical advancements, and community stories.",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Insights & Stories"
        highlight="Stories"
        description="Stay informed with the latest updates from the world of blood donation, health tips, and inspiring donor stories."
        variant="muted"
      />
      <FeaturedArticle />
      <ArticleGrid />
    </div>
  );
}
