import Database from "bun:sqlite";

export const db = new Database("notes.db", { strict: true });

export type Note = {
  id: number;
  title: string;
  content: string;
  updated_at: string;
};

export function getNotes(): Note[] {
  return db.query("SELECT * FROM notes").all() as Note[];
}

export function getNoteById(id: number): Note | undefined {
  const result = db.query("SELECT * FROM notes WHERE id = ?").all(id) as Note[];
  return result[0];
}

export function createNote({
  title,
  content,
}: {
  title: string;
  content: string;
}): Note {
  const stmt = db.prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
  const info = stmt.run(title, content);
  return {
    id: Number(info.lastInsertRowid),
    title,
    content,
    updated_at: new Date().toISOString(),
  };
}

export function updateNote(
  id: number,
  { title, content }: { title: string; content: string },
): Note | undefined {
  const stmt = db.prepare(
    "UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  );
  stmt.run(title, content, id);
  return getNoteById(id);
}

export function deleteNote(id: number): { success: boolean } {
  const stmt = db.prepare("DELETE FROM notes WHERE id = ?");
  stmt.run(id);
  return { success: true };
}
