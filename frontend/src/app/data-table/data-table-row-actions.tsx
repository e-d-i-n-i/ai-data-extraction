"use client";

import { useState } from "react";

import RemoveChunkForm from "@/components/forms/RemoveChunkForm";
import IconMenu from "@/components/icon-menu";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, FileSymlink, OctagonX } from "lucide-react";
import Link from "next/link";
import { SitePage } from "@/types/SitePage";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends SitePage>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const chunkId = row.original.id; // ID of the chunk
  const chunkTitle = row.original.title; // Title of the chunk

  return (
    <>
      {/* Dialog for removing a chunk */}
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Remove Chunk"
        description={`Are you sure you want to remove the chunk "${chunkTitle}" with ID of ${chunkId} ?`}
      >
        <RemoveChunkForm
          chunkId={chunkId}
          chunkTitle={chunkTitle}
          setIsOpen={setIsDeleteOpen}
        />
      </ResponsiveDialog>

      {/* Dropdown menu for actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          {/* Open Chunk Link */}
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
            <Button
              variant="ghost"
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              asChild
            >
              <Link href={`/admin/ai/preview/${row.original.id}`}>
                <FileSymlink className="h-4 w-4" />
                <span className="text-sm font-normal">Open Chunk</span>
              </Link>
            </Button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Remove Chunk Button */}
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75"
            >
              <IconMenu
                text="Remove Chunk"
                icon={<OctagonX className="h-4 w-4" />}
              />
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
