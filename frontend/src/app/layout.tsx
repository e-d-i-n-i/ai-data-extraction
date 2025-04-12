import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/side-bars/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { End } from "@/components/site/end";

export const metadata: Metadata = {
  metadataBase: new URL("https://edoctor.vercel.app"),
  title: "AI Ddata Extraction",
  description:
    "AI-driven system for structured data extraction, storage, and vector search, leveraging Crawl4AI, PydanticAI, and Supabase to enable efficient retrieval and RAG-based AI applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
              <div className="flex flex-col">
                <div className="flex-1 overflow-auto">{children}</div>
              </div>
              <End />
            </SidebarInset>
          </SidebarProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
