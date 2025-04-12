"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Plus, Layers } from "lucide-react";
import AddKnowledgeBaseSiteMap from "@/components/forms/AddKnowledgeBaseSiteMap";
import Link from "next/link";

const Home = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div>
      <div className="container mx-auto py-10 pl-3">
        <PageHeader
          title="Expand the Knowledge Base with SiteMaps"
          description="Easily enhance the knowledge base by uploading a sitemap file. Provide structured data to improve content discovery and retrieval."
        />
      </div>
      <section className="py-12">
        {/* Dialog for adding a SiteMap */}
        <ResponsiveDialog
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          title="Add to Knowledge Base"
          description="Upload a sitemap file to integrate structured information into your knowledge base. Ensure proper formatting for seamless processing."
        >
          <AddKnowledgeBaseSiteMap setIsOpen={setIsAddOpen} />
        </ResponsiveDialog>

        {/* Upload SiteMap Button */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <Layers className="h-20 w-20 text-blue-500" />{" "}
          <p className="text-gray-600 text-center max-w-md">
            Upload a sitemap file to enrich the knowledge base with
            well-structured data. Need a sitemap? Generate one at{" "}
            <Link
              href="https://www.xml-sitemaps.com/"
              className="font-semibold"
              target="_blank"
            >
              XML Sitemaps Generator
            </Link>
            .
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Upload SiteMap (XML)</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
