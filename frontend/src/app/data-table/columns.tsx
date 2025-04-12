"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { SitePage } from "@/types/SitePage";

export const columns: ColumnDef<SitePage>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title");
      const isEmpty = !title;

      return (
        <div className="capitalize">
          {isEmpty ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Empty field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            title
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("url");
      const isEmpty = !url;

      return (
        <div className="capitalize">
          {isEmpty ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Empty field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <a
              href={url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {url}
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "chunk_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chunk Number" />
    ),
    cell: ({ row }) => {
      const chunkNumber = row.getValue("chunk_number");
      const isEmpty = chunkNumber === null || chunkNumber === undefined; // Only null/undefined are considered empty

      return (
        <div className="capitalize">
          {isEmpty ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Empty field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            chunkNumber
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "summary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Summary" />
    ),
    cell: ({ row }) => {
      const summary = row.getValue("summary");
      const isEmpty = !summary;

      return (
        <div className="capitalize">
          {isEmpty ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Empty field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            summary
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at");
      const isEmpty = !createdAt;

      return (
        <div className="capitalize">
          {isEmpty ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Empty field</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            new Date(createdAt as string).toLocaleString()
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
