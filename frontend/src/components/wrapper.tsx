import { Circle } from "lucide-react";

export const Wrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string; // New prop for the title
}) => {
  return (
    <div className="no-scrollbar group relative w-full max-w-6xl overflow-hidden rounded-lg border bg-background drop-shadow-md transition-all fade-in hover:drop-shadow-xl sm:m-2">
      {/* Top Bar with Centered Title */}
      <div className="top-bar sticky top-0 z-30 flex h-10 items-center justify-between border-b bg-accent/50 px-4">
        {/* Left Section: Circles */}
        <div className="not-prose flex gap-2">
          <Circle className="w-3" />
          <Circle className="w-3" />
          <Circle className="w-3" />
        </div>

        {/* Centered Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium">
          {title}
        </div>
      </div>

      {/* Children content */}
      <div className="w-full p-5 pb-6">{children}</div>
    </div>
  );
};
