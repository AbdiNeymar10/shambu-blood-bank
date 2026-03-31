import { Container, Section } from "@/components/shared";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { siteConfig } from "@/config";

export default function HomePage() {
  return (
    <Section density="hero" className="bg-muted/40">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="soft" className="mb-4">
            Foundation ready
          </Badge>
          <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">Donate blood</Button>
            <Button size="lg" variant="outline">
              Request blood
            </Button>
            <Button size="lg" variant="destructive">
              Urgent need
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Design system</CardTitle>
              <CardDescription>
                Tokens, layout shell, and shared UI primitives are wired. Build
                home and dashboard features in{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  components/home
                </code>{" "}
                and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  components/dashboard
                </code>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Urgent</Badge>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
