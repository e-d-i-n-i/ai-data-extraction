"use client";

import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud, LockIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema
const formSchema = z.object({
  pdf_file: z.instanceof(File, { message: "A PDF file is required." }), // PDF file input
  url: z.string().min(1, "Add Title"), // URL input
  source: z.string().min(1, "Source is required"), // Source input
  current_password: z
    .string()
    .min(8, "Password must be at least 8 characters long"), // Password for confirmation
});

export default function AddKnowledgeBasePDFForm({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Function to close the form modal
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdf_file: undefined,
      url: "",
      source: "",
      current_password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("pdf_file", values.pdf_file);
      formData.append("url", values.url);
      formData.append("source", values.source);
      formData.append("current_password", values.current_password); // Add current password

      // Call the API to process the PDF
      const response = await axios.post(
        process.env.NEXT_PUBLIC_PROCESS_PDF_ENDPOINT!, // Replace with your API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      if (response.status === 200) {
        toast.success("PDF processed and added to knowledge base successfully");
        setIsOpen(false); // Close the form modal
      } else {
        toast.error("Failed to process PDF");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while processing the PDF"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:px-0 px-4"
      >
        {/* PDF File Upload */}
        <FormField
          control={form.control}
          name="pdf_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload PDF</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                      }
                    }}
                    className="pl-10 pr-4 py-2"
                  />
                  <UploadCloud
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL Input */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter URL (e.g., https://example.com)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Source Input */}
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter source (e.g., medical_docs)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current Password Input */}
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    className="pl-10 pr-4 py-2"
                    {...field}
                    value={field.value || ""}
                  />
                  <LockIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit and Cancel Buttons */}
        <div className="w-full flex justify-center sm:space-x-6">
          <Button
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="w-full hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <span>Add to Knowledge Base</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
