import { Clock, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getPublicBlogPostBySlug } from "@/lib/actions/articles";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublicBlogPostBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Article Header */}
      <section className="pt-32 pb-12">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider rounded-full">
              {article.category}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {article.readTime}
            </span>
            <span className="text-muted-foreground text-sm">{article.publishDate}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-8">
            {article.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="font-bold">{article.author}</div>
                <div className="text-sm text-muted-foreground">Shambu Medical Team</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block mr-2">Share:</span>
              <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="container px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-muted">
          <img 
            src={article.coverImageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <section className="pb-24">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <article className="prose prose-lg prose-slate dark:prose-invert max-w-none space-y-6 text-foreground">
            {article.excerpt && (
              <p className="lead text-xl text-muted-foreground font-medium leading-relaxed">
                {article.excerpt}
              </p>
            )}

            <div className="whitespace-pre-wrap leading-relaxed text-foreground text-base">
              {article.content}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4 mt-0 text-foreground">Ready to save lives in your community?</h3>
              <p className="mb-6 text-muted-foreground">Schedule a donation appointment today at Shambu General Hospital.</p>
              <Link href="/donate">
                <Button size="lg">Schedule Your Donation</Button>
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
