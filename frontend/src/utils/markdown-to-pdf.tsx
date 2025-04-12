"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import PDFDocument from "./pdf_format";

interface MarkdownToPdfProps {
  markdown: string;
  filename?: string;
}

export default function MarkdownToPdf({
  markdown,
  filename = "markdown-document.pdf",
}: MarkdownToPdfProps) {
  return (
    <PDFDownloadLink
      document={<PDFDocument markdown={markdown} />}
      fileName={filename}
      className="text-indigo-500 hover:text-white"
    >
      {({ blob, url, loading, error }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-indigo-500 hover:text-white hover:bg-green-900"
          disabled={loading}
        >
          <ArrowDownToLine className="w-4 h-4 mr-1" />
          {loading ? "Generating PDF..." : "Download"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
