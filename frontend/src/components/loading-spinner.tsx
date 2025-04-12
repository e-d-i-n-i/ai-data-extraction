"use client";

import { useEffect, useState } from "react";

export default function LoadingSpinner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative flex flex-col h-[45px] w-[45px] rotate-45 animate-[rotate_3.5s_ease-in-out_infinite]">
        <div className="absolute flex items-center justify-center w-[19.575px] h-[19.575px] overflow-hidden isolate top-[8.25%] left-[8.25%] rounded-[50%_50%_3px]">
          <div className="absolute inset-0 bg-foreground opacity-10" />
          <div className="relative z-10 block bg-foreground h-full w-full origin-bottom-right rounded-[0_0_2.25px_0] animate-[flow_3.5s_linear_infinite_both]" />
        </div>
        <div className="absolute flex items-center justify-center w-[19.575px] h-[19.575px] overflow-hidden isolate bottom-[8.25%] right-[8.25%] rotate-180 self-end rounded-[50%_50%_3px]">
          <div className="absolute inset-0 bg-foreground opacity-10" />
          <div className="relative z-10 block bg-foreground h-full w-full origin-bottom-right rounded-[0_0_2.25px_0] animate-[flow_3.5s_linear_-1.75s_infinite_both]" />
        </div>
      </div>
    </div>
  );
}
