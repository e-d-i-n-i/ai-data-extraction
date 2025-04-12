"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDownToLine, LightbulbIcon } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "./pdf_format";

// Define custom components for ReactMarkdown
const mdxComponents = {
  h1: ({ ...props }) => <h1 className="text-2xl font-bold" {...props} />,
  h2: ({ ...props }) => <h2 className="text-xl font-semibold" {...props} />,
  p: ({ ...props }) => <p className="text-base leading-relaxed" {...props} />,
  ul: ({ ...props }) => <ul className="list-disc ml-5" {...props} />,
  li: ({ ...props }) => <li className="mb-1" {...props} />,
  strong: ({ ...props }) => <strong className="font-bold" {...props} />,
  // Add a custom component for the root element to apply the `prose` class
  div: ({ ...props }) => (
    <div className="prose dark:prose-invert max-w-none text-base" {...props} />
  ),
};

interface MarkdownPreviewerProps {
  markdown: string;
  filename?: string;
}

export default function MarkdownPreviewer({
  markdown,
  filename = "markdown-document.pdf",
}: MarkdownPreviewerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-white hover:bg-green-900"
        >
          <LightbulbIcon className="w-4 h-4 mr-1" />
          Explain Reasoning
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] max-w-screen-lg p-5">
        <DialogHeader>
          <DialogTitle>Reasoning Preview</DialogTitle>
          <DialogDescription>
            View the explanation and download it as a PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-background border-2 p-4 shadow prose max-w-none h-[60vh] overflow-y-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
            {markdown}
          </ReactMarkdown>
        </div>
        <DialogFooter className="sm:justify-start">
          <PDFDownloadLink
            document={<PDFDocument markdown={markdown} />}
            fileName={filename}
          >
            {({ loading }) => (
              <Button variant="default" size="sm" disabled={loading}>
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                {loading ? "Loading document..." : "Download as PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
