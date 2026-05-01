import { Clock, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Note: In a real app, you would fetch data based on the slug.
// For now, we use a static layout.

export default function BlogPostPage() {
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
              Nutrition
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 3 min read
            </span>
            <span className="text-muted-foreground text-sm">Oct 10, 2026</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-8">
            10 Iron-Rich Foods to Eat Before You Donate
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop" alt="Author" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold">Dr. Sarah Jenkins</div>
                <div className="text-sm text-muted-foreground">Chief Medical Officer</div>
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
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop" 
            alt="Healthy iron-rich food" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <section className="pb-24">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <p className="lead text-xl text-muted-foreground font-medium">
              Maintaining healthy iron levels is crucial for a successful blood donation and for your own well-being afterward. Here are the top foods you should incorporate into your diet leading up to your appointment.
            </p>

            <h2>Why is Iron Important?</h2>
            <p>
              Iron is a mineral that your body needs to make hemoglobin, the protein in red blood cells that carries oxygen from your lungs to the rest of your body. When you donate blood, you lose some iron. If your levels are too low prior to donation, you may be temporarily deferred.
            </p>

            <h3>1. Lean Meats (Heme Iron)</h3>
            <p>
              Heme iron is found in animal products and is absorbed by your body more easily than plant-based iron. Excellent sources include:
            </p>
            <ul>
              <li>Beef</li>
              <li>Chicken</li>
              <li>Turkey</li>
              <li>Fish (like tuna or salmon)</li>
            </ul>

            <h3>2. Leafy Greens (Non-Heme Iron)</h3>
            <p>
              For vegetarians or those looking to add more greens to their diet, dark leafy vegetables are a staple. Keep in mind that non-heme iron isn't absorbed as easily, so pair these with Vitamin C (like a squeeze of lemon) to boost absorption!
            </p>
            <ul>
              <li>Spinach</li>
              <li>Kale</li>
              <li>Swiss chard</li>
            </ul>

            <blockquote className="border-l-4 border-primary pl-6 italic my-8 text-xl">
              "Eating a well-balanced, iron-rich diet is the easiest way to ensure you're always ready to save a life when the community needs it." — Dr. Jenkins
            </blockquote>

            <h2>What to Avoid</h2>
            <p>
              Some foods and drinks can inhibit iron absorption. In the days leading up to your donation, try to separate your iron-rich meals from:
            </p>
            <ul>
              <li>Coffee and tea (contain tannins)</li>
              <li>High-calcium foods (milk, cheese) right around mealtime</li>
              <li>Foods high in bran or phytic acid</li>
            </ul>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4 mt-0">Ready to put that iron to good use?</h3>
              <p className="mb-6 text-muted-foreground">Your donation is needed now more than ever.</p>
              <Button size="lg">Schedule Your Donation</Button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
