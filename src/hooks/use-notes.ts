// src/client/hooks/useNotes.ts
import type { Note } from "@/server/notes";
import { useState, useEffect, useRef } from "react";

type Message =
  | { type: "NEW_NOTE"; note: Note }
  | { type: "UPDATE_NOTE"; note: Note }
  | { type: "DELETE_NOTE"; note: { id: number } };

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch all notes when the hook mounts
  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data: Note[]) => setNotes(data))
      .catch(console.error);
  }, []);

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.host}/ws`);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      setNotes((prevNotes) => {
        switch (message.type) {
          case "NEW_NOTE":
            return [...prevNotes, message.note];
          case "UPDATE_NOTE":
            return prevNotes.map((note) =>
              note.id === message.note.id ? message.note : note,
            );
          case "DELETE_NOTE":
            return prevNotes.filter((note) => note.id !== message.note.id);
          default:
            return prevNotes;
        }
      });
    };

    return () => {
      socket.close();
    };
  }, []);

  // Function to create a note (server broadcast will update the state)
  const createNote = async (
    title: string,
    content: string,
  ): Promise<Note | void> => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      return res.json();
    }
  };

  // Function to update a note (server broadcast will update the state)
  const updateNote = async (
    id: number,
    title: string,
    content: string,
  ): Promise<Note | void> => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      return res.json();
    }
  };

  // Function to delete a note (server broadcast will update the state)
  const deleteNote = async (id: number): Promise<boolean> => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    return res.ok;
  };

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    ws: wsRef.current,
  };
}
