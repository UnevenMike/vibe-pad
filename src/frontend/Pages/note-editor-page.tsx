// src/client/NoteEditorPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Note } from "@/server/notes";
import { useNotesContext } from "../Context/NotesContext";

const NoteEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, updateNote } = useNotesContext();
  const [localNote, setLocalNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // When the context's notes change or the route id changes, update local state.
  useEffect(() => {
    if (id && notes.length > 0) {
      const noteId = Number(id);
      const foundNote = notes.find((n) => n.id === noteId);
      console.log(noteId, foundNote, notes);
      if (foundNote) {
        setLocalNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
      } else {
        // If the note isn't found in the context, navigate back to /app
        navigate("/app");
      }
    }
  }, [id, notes, navigate]);

  const handleSave = async () => {
    if (!id) return;
    const noteId = Number(id);
    const updated = await updateNote(noteId, title, content);
    if (updated) {
      setLocalNote(updated);
    }
  };

  if (!localNote) {
    return <div className="p-4">Loading note...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Note</h1>
      <div className="mb-4">
        <label className="block font-medium">Title</label>
        <input
          type="text"
          className="w-full rounded border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Content</label>
        <textarea
          className="w-full rounded border p-2"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <button
        onClick={handleSave}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default NoteEditorPage;
