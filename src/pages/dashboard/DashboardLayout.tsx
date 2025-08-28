import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Mic, Library } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const isCreate = /\/dashboard(\/create)?$/.test(path);
  const isLibrary = /\/dashboard\/library$/.test(path);

  return (
    <SidebarProvider>
      <Sidebar
        variant="inset"
        collapsible="icon"
        className="border-r border-border/60 bg-sidebar/80 backdrop-blur-xl"
      >
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">PitchPal</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isCreate}
                    tooltip="Create"
                  >
                    <Link
                      to="/dashboard/create"
                      className={cn("flex items-center gap-2")}
                    >
                      {" "}
                      <Mic className="w-4 h-4" /> <span>Create</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isLibrary}
                    tooltip="Library"
                  >
                    <Link
                      to="/dashboard/library"
                      className="flex items-center gap-2"
                    >
                      {" "}
                      <Library className="w-4 h-4" /> <span>Library</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background/60 backdrop-blur-sm">
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
