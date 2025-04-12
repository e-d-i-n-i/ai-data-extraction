import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-[750px]">{description}</p>
    </div>
  );
}
