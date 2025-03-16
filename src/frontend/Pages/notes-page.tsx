// src/client/NotesPage.tsx
import "@/../styles/globals.css";
import React, { useState } from "react";
import type { Note } from "@/server/notes";
import { useNotesContext } from "../Context/NotesContext";

export default function NotesPage() {
  // Get the shared notes state and functions from context
  const { notes, createNote } = useNotesContext();

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">Collaborative Notes</h1>
      <NoteEditor onNoteCreated={createNote} />
      <NoteList notes={notes} />
    </>
  );
}

type NoteEditorProps = {
  // Our context createNote function accepts (title, content)
  onNoteCreated: (title: string, content: string) => Promise<Note | void>;
};

const NoteEditor: React.FC<NoteEditorProps> = ({ onNoteCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreateNote = async () => {
    await onNoteCreated(title, content);
    // Reset fields after creation
    setTitle("");
    setContent("");
  };

  return (
    <div className="mb-6">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 w-full rounded border p-2"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-2 w-full rounded border p-2"
      ></textarea>
      <button
        onClick={handleCreateNote}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Create Note
      </button>
    </div>
  );
};

type NoteListProps = {
  notes: Note[];
};

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold">Notes</h2>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id} className="rounded border p-2">
            <strong>{note.title}</strong> - {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
};
