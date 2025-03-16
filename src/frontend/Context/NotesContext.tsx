// src/client/context/NotesContext.tsx
import { useNotes } from "@/hooks/use-notes";
import type { Note } from "@/server/notes";
import React, { createContext, useContext } from "react";

type NotesContextType = {
  notes: Note[];
  createNote: (title: string, content: string) => Promise<Note | void>;
  updateNote: (
    id: number,
    title: string,
    content: string,
  ) => Promise<Note | void>;
  deleteNote: (id: number) => Promise<boolean>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notes, createNote, updateNote, deleteNote } = useNotes();

  return (
    <NotesContext.Provider
      value={{ notes, createNote, updateNote, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotesContext must be used within a NotesProvider");
  }
  return context;
};
