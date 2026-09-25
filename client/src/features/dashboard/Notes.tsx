import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
};

const NOTES_KEY = "studyforge_notes";

function loadNotes(): Note[] {
  try {
    const savedNotes = localStorage.getItem(NOTES_KEY);

    if (savedNotes === null) {
      return [];
    }

    const parsedNotes: unknown = JSON.parse(savedNotes);

    if (!Array.isArray(parsedNotes)) {
      return [];
    }

    return parsedNotes.filter(
      (note): note is Note =>
        typeof note === "object" &&
        note !== null &&
        "id" in note &&
        "title" in note &&
        "content" in note &&
        typeof note.id === "string" &&
        typeof note.title === "string" &&
        typeof note.content === "string"
    );
  } catch {
    return [];
  }
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        NOTES_KEY,
        JSON.stringify(notes)
      );
    } catch {
      // Notes still work during this session.
    }
  }, [notes]);

  function saveNote(): void {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (cleanTitle === "" || cleanContent === "") {
      return;
    }

    if (editingId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: cleanTitle,
                content: cleanContent,
              }
            : note
        )
      );

      setEditingId(null);
    } else {
      const newNote: Note = {
        id: `${Date.now()}-${Math.random()}`,
        title: cleanTitle,
        content: cleanContent,
      };

      setNotes((currentNotes) => [
        newNote,
        ...currentNotes,
      ]);
    }

    setTitle("");
    setContent("");
  }

  function editNote(note: Note): void {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  function deleteNote(id: string): void {
    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== id
      )
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  function cancelEdit(): void {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  const filteredNotes = notes.filter((note) => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (searchText === "") {
      return true;
    }

    return (
      note.title
        .toLowerCase()
        .includes(searchText) ||
      note.content
        .toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <section
      className="mt-8 rounded-3xl border p-6"
      style={{
        background: "var(--sf-surface)",
        borderColor: "var(--sf-surface-soft)",
        boxShadow: "var(--sf-shadow)",
      }}
    >
      <div className="mb-6">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{
            color: "var(--sf-secondary)",
          }}
        >
          MY NOTES
        </p>

        <h2 className="mt-1 text-2xl font-black">
          Capture what you learn
        </h2>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--sf-text-muted)",
          }}
        >
          Save important ideas and review them later.
        </p>
      </div>

      {/* NOTE EDITOR */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--sf-surface-soft)",
        }}
      >
        <h3 className="font-black">
          {editingId !== null
            ? "Edit note"
            : "Create a note"}
        </h3>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Note title"
          className="mt-4 w-full rounded-xl border px-4 py-3"
          style={{
            background: "var(--sf-bg)",
            borderColor: "var(--sf-surface-soft)",
            color: "var(--sf-text)",
          }}
        />

        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="Write your notes here..."
          rows={5}
          className="mt-3 w-full resize-y rounded-xl border px-4 py-3"
          style={{
            background: "var(--sf-bg)",
            borderColor: "var(--sf-surface-soft)",
            color: "var(--sf-text)",
          }}
        />

        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveNote}
            disabled={
              title.trim() === "" ||
              content.trim() === ""
            }
            className="min-h-11 rounded-xl px-5 py-3 font-black disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "var(--sf-primary)",
              color: "var(--sf-bg)",
            }}
          >
            {editingId !== null
              ? "💾 Update Note"
              : "➕ Save Note"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="min-h-11 rounded-xl px-5 py-3 font-bold"
              style={{
                background:
                  "var(--sf-bg)",
                color: "var(--sf-text)",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="mt-6">
        <label
          htmlFor="note-search"
          className="mb-2 block text-sm font-bold"
        >
          Search notes
        </label>

        <input
          id="note-search"
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by title or content..."
          className="w-full rounded-xl border px-4 py-3"
          style={{
            background: "var(--sf-bg)",
            borderColor: "var(--sf-surface-soft)",
            color: "var(--sf-text)",
          }}
        />
      </div>

      {/* NOTES LIST */}
      <div className="mt-6">
        {filteredNotes.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background:
                "var(--sf-surface-soft)",
            }}
          >
            <div className="text-4xl" aria-hidden="true">
              📝
            </div>

            <p className="mt-3 font-bold">
              {notes.length === 0
                ? "No notes yet."
                : "No matching notes found."}
            </p>

            <p
              className="mt-1 text-sm"
              style={{
                color:
                  "var(--sf-text-muted)",
              }}
            >
              {notes.length === 0
                ? "Create your first note above."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredNotes.map((note) => (
              <article
                key={note.id}
                className="rounded-2xl border p-5"
                style={{
                  background:
                    "var(--sf-surface-soft)",
                  borderColor:
                    "var(--sf-surface-soft)",
                }}
              >
                <h3 className="text-lg font-black">
                  {note.title}
                </h3>

                <p
                  className="mt-3 whitespace-pre-wrap text-sm leading-6"
                  style={{
                    color:
                      "var(--sf-text-muted)",
                  }}
                >
                  {note.content}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      editNote(note)
                    }
                    className="min-h-11 rounded-xl px-4 py-2 text-sm font-bold"
                    style={{
                      background:
                        "var(--sf-bg)",
                      color:
                        "var(--sf-text)",
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteNote(note.id)
                    }
                    className="min-h-11 rounded-xl px-4 py-2 text-sm font-bold"
                    style={{
                      background:
                        "var(--sf-bg)",
                      color:
                        "var(--sf-danger)",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}