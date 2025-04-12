"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import images
import EdiniAmare from "@/assets/img/edini-amare.jpg";

// Define the team members data
const teamMembers = [
  {
    id: "3",
    fullName: "Edini Amare",
    avatar: EdiniAmare,
    fallback: "EA",
    role: "Full Stack Developer",
    description:
      "Versatile developer with expertise in both frontend and backend technologies.",
    github: "https://github.com/e-d-i-n-i",
    linkedin: "https://www.linkedin.com/in/edini-amare",
    hashtags: ["#FullStack", "#JavaScript", "#DevOps"],
  },
];

export function TeamMembers() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap justify-center gap-6">
        {teamMembers.map((member) => (
          <Popover
            key={member.id}
            open={open === member.id}
            onOpenChange={(isOpen) => setOpen(isOpen ? member.id : null)}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <button className="cursor-pointer transition-transform hover:scale-105">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={member.avatar.src}
                        alt={member.fullName}
                      />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{member.fullName}</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent className="w-80 p-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={member.avatar.src} alt={member.fullName} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{member.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <p className="text-sm text-center">{member.description}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </TooltipProvider>
  );
}
