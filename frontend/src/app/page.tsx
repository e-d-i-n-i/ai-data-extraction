"use client";
import React from "react";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "./data-table/data-table";
import CTACard from "@/components/cta-card";
import { Globe, Layers, FileText } from "lucide-react";
const Home = () => {
  return (
    <div>
      <div className="container mx-auto py-10 pl-3">
        <PageHeader
          title="Knowledge Base"
          description="This page displays the knowledge have been accumulated on supabase. You can search by title, add new data, remove chunks, and manage the knowledge base efficiently."
        />
      </div>
      <section className=" py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 bg-transparent md:grid-cols-3 gap-6">
            <CTACard
              title="Web Link"
              icon={<Globe className="h-8 w-8 text-blue-500" />}
              description="Expand the knowledge base by scraping a specific website and integrating the data into the existing knowledge base."
              href="/new/website"
            />
            <CTACard
              title="Site Map"
              icon={<Layers className="h-8 w-8  text-primary" />}
              description="Expand the knowledge base by crawling a specific website using its sitemap and integrating the data into the existing knowledge base."
              href="/new/sitemap"
            />
            <CTACard
              title="PDF"
              icon={<FileText className="h-8 w-8 text-blue-500 text-primary" />}
              description="Expand the knowledge base by extracting data from a specific website's PDF documents and integrating it into the existing knowledge base."
              href="/new/pdf"
            />
          </div>
        </div>
      </section>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex-1 rounded-xl bg-muted/50 p-3">
          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
