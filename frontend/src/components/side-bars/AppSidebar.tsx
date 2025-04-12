"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShieldPlus,
} from "lucide-react";
import { NavGeneral } from "@/components/navigation/nav-general";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const data = {
  user: {
    name: "user",
    email: "m@example.com",
    avatar: "/img/placeholder.png",
  },
  navGeneral: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Website",
          url: "/new/website",
        },
        {
          title: "PDF",
          url: "/new/pdf",
        },
        {
          title: "SiteMap",
          url: "/new/sitemap",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, state } = useSidebar();
  const isSidebarExpanded = state === "expanded";
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <ShieldPlus className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate">ai-data-extraction</span>
                  <span className="truncate text-xs">Navigation</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Conditionally render DialogTitle only on mobile */}
        {isMobile && (
          <DialogTitle>
            <VisuallyHidden>Admin Sidebar</VisuallyHidden>
          </DialogTitle>
        )}

        <NavGeneral items={data.navGeneral} />
        <div className="absolute bottom-4 right-2">
          <button
            type="button"
            className="absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center border border-muted-foreground/20 rounded-full bg-accent shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? (
              <ChevronLeft size={16} className="stroke-foreground" />
            ) : (
              <ChevronRight size={16} className="stroke-foreground" />
            )}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
