import { createBrowserRouter } from "react-router";
import HomePage from "./Pages/home-page";
import NoteEditorPage from "./Pages/note-editor-page";
import AppLayout from "./Layout/app-layout";
import NotesPage from "./Pages/notes-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: NotesPage,
      },
      {
        path: "notes/:id",
        Component: NoteEditorPage,
      },
    ],
  },
]);
