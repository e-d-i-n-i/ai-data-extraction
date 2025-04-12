import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReactNode } from "react";
import Link from "next/link";

interface CTACardProps {
  title: string;
  icon: ReactNode;
  description: string;
  href: string; // Add href prop for dynamic routing
}

export default function CTACard({
  title,
  icon,
  description,
  href,
}: CTACardProps) {
  return (
    <div className="flex justify-center items-center h-fit w-fit border-2 rounded-xl border-border">
      <Card className="w-full aspect-square flex flex-col border-0 shadow-lg transition-all hover:shadow-xl">
        <CardHeader className="flex-1 flex items-center justify-center pb-0">
          <div className="rounded-full bg-primary/10 p-4 mb-4">{icon}</div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center px-6 space-y-2">
          <h3 className="font-semibold text-center text-xl">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button className="w-full group" asChild>
            <Link href={href}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
