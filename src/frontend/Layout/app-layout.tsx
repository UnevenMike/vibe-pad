// src/client/AppLayout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router";
import { AppSidebar } from "./app-side-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNotesContext } from "../Context/NotesContext";

const AppLayout: React.FC = () => {
  // Get shared notes from the NotesProvider context
  const { notes } = useNotesContext();
  const location = useLocation();

  // Determine selected note based on the current URL (if needed)
  const selectedNoteId = Number(location.pathname.split("/").pop() || "0");

  return (
    <SidebarProvider>
      <AppSidebar notes={notes} />
      <main>
        <div className="p-4">
          <SidebarTrigger />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AppLayout;
