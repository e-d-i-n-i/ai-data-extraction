"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Plus, FileText } from "lucide-react"; // Added FileText for PDF icon
import AddKnowledgeBasePDFForm from "@/components/forms/AddKnowledgeBasePDF";

const Home = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div>
      <div className="container mx-auto py-10 pl-3">
        <PageHeader
          title="Enhance the Knowledge Base with PDFs"
          description="Upload PDF documents to expand and enrich the knowledge base. Easily add new information by specifying the source type and uploading your files."
        />
      </div>
      <section className="py-12">
        {/* Dialog for adding a PDF */}
        <ResponsiveDialog
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          title="Add to Knowledge Base"
          description="Upload a PDF document to add valuable information to the knowledge base. Ensure the file is well-structured for optimal processing."
        >
          <AddKnowledgeBasePDFForm setIsOpen={setIsAddOpen} />
        </ResponsiveDialog>

        {/* Upload PDF Button */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileText className="h-20 w-20 text-blue-500" />{" "}
          {/* Large PDF icon */}
          <p className="text-gray-600 text-center max-w-md">
            Click the button below to upload a PDF and add it to your knowledge
            base. Supported formats include research papers, manuals, and
            reports.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Upload PDF</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
