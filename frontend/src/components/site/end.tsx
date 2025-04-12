import * as Craft from "@/components/craft";
import { ModeToggle } from "@/components/site/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { TeamMembers } from "@/components/site/team-members";

export const End = () => {
  return (
    <Craft.Section className="py-8 md:py-12">
      <Craft.Container className="flex flex-col space-y-8 font-light not-prose">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <span className="text-sm md:text-base">Built by</span>
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-4 w-4" />
              <TeamMembers />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="outline" asChild size="icon">
              <Link href="https://github.com/e-d-i-n-i">
                <Github className="h-5 w-5 transition-all" />
                <span className="sr-only">Visit Github</span>
              </Link>
            </Button>
            <Button variant="outline" asChild size="icon">
              <Link href="https://www.linkedin.com/in/edini-amare/">
                <Linkedin className="h-5 w-5 transition-all" />
                <span className="sr-only">Visit LinkedIn</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2 text-center md:items-start md:text-left">
          <p className="text-sm font-expose">
            Source code can be found on{" "}
            <a
              className="border-b transition-all hover:border-b-orange-500"
              href="https://github.com/e-d-i-n-i/ai-data-extraction"
            >
              GitHub
            </a>
            .
          </p>
          <p className="text-xs opacity-70">
            ai-data-extraction © {new Date().getFullYear()}
          </p>
        </div>
      </Craft.Container>
    </Craft.Section>
  );
};
