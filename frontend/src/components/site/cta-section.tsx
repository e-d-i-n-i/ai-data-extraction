import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CTA() {
  return (
    <section className="py-16 sm:py-24">
      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-4">
            Ready to transform healthcare?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start using E-DOCTOR today and bring AI-powered diagnostics and
            smarter decision-making to your practice.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Get Started Now</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
