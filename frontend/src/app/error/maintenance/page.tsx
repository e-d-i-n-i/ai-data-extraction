"use client";
import { useRouter } from "next/navigation"; // Use Next.js's router
import { Button } from "@/components/ui/button";

export default function UnauthorisedError() {
  const router = useRouter();

  const goBackTwoSteps = () => {
    // Go back two steps in history
    if (window.history.length > 2) {
      router.back(); // Go back once
      setTimeout(() => router.back(), 100); // Go back again after a short delay
    } else {
      router.push("/"); // Fallback to home if there aren't enough history entries
    }
  };

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">503</h1>
        <span className="font-medium">Website is under maintenance!</span>
        <p className="text-center text-muted-foreground">
          The site is not available at the moment. <br />
          We will be back online shortly.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={goBackTwoSteps}>
            Go Back
          </Button>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
