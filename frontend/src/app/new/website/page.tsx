"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Plus, Globe } from "lucide-react";
import AddKnowledgeBaseWebCrawl from "@/components/forms/AddKnowledgeBaseWebCrawl";

const Home = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div>
      <div className="container mx-auto py-10 pl-3">
        <PageHeader
          title="Expand the Knowledge Base with Website Data"
          description="Enhance your knowledge base by adding website content. Provide a relevant link to extract structured information for better insights."
        />
      </div>
      <section className="py-12">
        {/* Dialog for adding a Website Link */}
        <ResponsiveDialog
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          title="Add Website Data"
          description="Submit a website link to extract valuable content for your knowledge base. Ensure the URL is properly formatted and contains relevant information."
        >
          <AddKnowledgeBaseWebCrawl setIsOpen={setIsAddOpen} />
        </ResponsiveDialog>

        {/* Upload Website Link Button */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <Globe className="h-20 w-20 text-blue-500" />
          <p className="text-gray-600 text-center max-w-md">
            Add structured data to your knowledge base by submitting a website
            link. Ensure the site contains relevant and high-quality content for
            accurate processing.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Upload Website Link</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
