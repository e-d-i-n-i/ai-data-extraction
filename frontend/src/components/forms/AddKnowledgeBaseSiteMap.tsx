"use client";

import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockIcon, FileInput } from "lucide-react";
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
  sitemap_file: z.instanceof(File, { message: "A sitemap file is required." }),
  source: z.string().min(1, "Source is required"),
  current_password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function AddKnowledgeBaseSiteMap({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sitemap_file: undefined,
      source: "",
      current_password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("sitemap_file", values.sitemap_file);
      formData.append("source", values.source);
      formData.append("current_password", values.current_password);

      // Call the API to process the sitemap
      const response = await axios.post(
        process.env.NEXT_PUBLIC_PROCESS_SITEMAP_ENDPOINT!,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sitemap processed successfully");
        setIsOpen(false);
      } else {
        toast.error("Failed to process sitemap");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while processing the sitemap"
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
        {/* Sitemap File Upload */}
        <FormField
          control={form.control}
          name="sitemap_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Sitemap</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                      }
                    }}
                    className="pl-10 pr-4 py-2"
                  />
                  <FileInput
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
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
