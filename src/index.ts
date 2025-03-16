import { serve } from "bun";
import index from "./index.html";
import {
  createNote,
  db,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
  type Note,
} from "./server/notes";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec("PRAGMA journal_mode = WAL;");

type Message =
  | { type: "NEW_NOTE"; note: any }
  | { type: "UPDATE_NOTE"; note: any }
  | { type: "DELETE_NOTE"; note: any };

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/api/notes": {
      GET: () => {
        const notes = getNotes();
        return Response.json(notes);
      },

      // Create post
      POST: async (req) => {
        const note: Omit<Note, "id" | "updated_at"> = await req.json();

        const newNote = createNote({
          title: note.title,
          content: note.content,
        });

        server.publish(
          "notes",
          JSON.stringify({ type: "NEW_NOTE", note: newNote }),
        );

        return Response.json({ ...newNote }, { status: 201 });
      },
    },

    "/api/notes/:id": {
      GET: (req) => {
        const idAsNumber = Number(req.params.id);
        if (isNaN(idAsNumber)) {
          return new Response("Invalid ID", { status: 400 });
        }

        const note = getNoteById(idAsNumber);
        if (!note) {
          return new Response("Not Found", { status: 404 });
        }

        return Response.json(note);
      },

      PUT: async (req) => {
        const idAsNumber = Number(req.params.id);
        if (isNaN(idAsNumber)) {
          return new Response("Invalid ID", { status: 400 });
        }

        const note: Omit<Note, "id" | "updated_at"> = await req.json();
        const updatedNote = updateNote(idAsNumber, {
          title: note.title,
          content: note.content,
        });

        server.publish(
          "notes",
          JSON.stringify({ type: "UPDATE_NOTE", note: updatedNote }),
        );

        return Response.json(updatedNote);
      },

      DELETE: (req) => {
        const idAsNumber = Number(req.params.id);
        if (isNaN(idAsNumber)) {
          return new Response("Invalid ID", { status: 400 });
        }

        server.publish(
          "notes",
          JSON.stringify({ type: "DELETE_NOTE", note: { id: idAsNumber } }),
        );

        const success = deleteNote(idAsNumber);
        return Response.json(success);
      },
    },

    "/api/*": () => new Response("Not Found", { status: 404 }),
  },

  // This is needed to handle WebSocket connections... I'm not sure how this will work with the fallback to index.html
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }

    return new Response("Upgrade to WebSocket failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      console.log("Message", message);
      ws.send(message);
    }, // a message is received
    open(ws) {
      console.log("Open new socket. Connecting to the notes channel");
      ws.subscribe("notes");
      server.publish("notes", JSON.stringify({ msg: "User Entered" }));
      console.log("Open");
    },
    close(ws, code, message) {
      console.log("Close", code, message);
      ws.unsubscribe("notes");
      ws.publish("notes", JSON.stringify({ msg: "User Left" }));
    }, // a socket is closed
    drain(ws) {
      console.log("Drain");
    },
  },

  error(error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
