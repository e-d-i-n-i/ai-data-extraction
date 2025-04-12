"use client";

import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockIcon } from "lucide-react";
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
  chunk_id: z.number(), // ID of the chunk to be removed
  current_password: z
    .string()
    .min(8, "Password must be at least 8 characters long"), // Password for confirmation
});

export default function RemoveChunkForm({
  chunkId,
  chunkTitle,
  setIsOpen,
}: {
  chunkId: number; // ID of the chunk to be removed
  chunkTitle: string; // Title of the chunk (for display purposes)
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Function to close the form modal
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chunk_id: chunkId,
      current_password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call the API to remove the chunk
      const response = await axios.post(
        process.env.NEXT_PUBLIC_REMOVE_CHUNK_ENDPOINT!, // Replace with your API endpoint
        {
          page_id: values.chunk_id, // Include the chunk ID
          current_password: values.current_password, // Include the current password for confirmation
        }
      );

      if (response.status === 200) {
        toast.success(`Chunk "${chunkTitle}" removed successfully`);
        setIsOpen(false); // Close the form modal
      } else {
        toast.error("Failed to remove chunk");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while removing the chunk"
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
            className="w-full bg-red-500 hover:bg-red-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing
              </>
            ) : (
              <span>Remove Chunk</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
