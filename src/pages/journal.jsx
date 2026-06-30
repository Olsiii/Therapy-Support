import { useState, useEffect, useMemo } from "react";
import { Button } from "../components/ui/button";

const STORAGE_KEY = "ts_journal_entries";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function highlight(text, query) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} style={{ background: "var(--accent-bg)", color: "var(--accent)", borderRadius: 3 }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const BLANK_FORM = { title: "", content: "" };

export default function Journal() {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(BLANK_FORM);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("list"); // "list" | "compose"

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter(
      (e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.content.trim()) errs.content = "Content is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editId
            ? { ...entry, title: form.title.trim(), content: form.content.trim(), updatedAt: new Date().toISOString() }
            : entry
        )
      );
      setEditId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        title: form.title.trim(),
        content: form.content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setEntries((prev) => [newEntry, ...prev]);
    }

    setForm(BLANK_FORM);
    setErrors({});
    setView("list");
  };

  const startEdit = (entry) => {
    setForm({ title: entry.title, content: entry.content });
    setEditId(entry.id);
    setErrors({});
    setView("compose");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelCompose = () => {
    setForm(BLANK_FORM);
    setEditId(null);
    setErrors({});
    setView("list");
  };

  const deleteEntry = (id) => {
    if (window.confirm("Delete this journal entry?")) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (editId === id) cancelCompose();
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${hasError ? "#ef4444" : "var(--border)"}`,
    borderRadius: 12,
    fontSize: 14,
    color: "var(--text-h)",
    background: "var(--bg)",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  });

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-h)", margin: 0 }}>
            Journal
          </h1>
          <p style={{ color: "var(--text)", margin: "4px 0 0" }}>
            Write freely. Your entries stay private on this device.
          </p>
        </div>
        {view === "list" && (
          <Button onClick={() => { setView("compose"); setForm(BLANK_FORM); setEditId(null); }}>
            + New entry
          </Button>
        )}
      </div>

      {/* --- Compose / Edit Form --- */}
      {view === "compose" && (
        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "32px",
            marginTop: 28,
            marginBottom: 36,
            boxShadow: "var(--shadow)",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-h)", marginTop: 0, marginBottom: 20 }}>
            {editId ? "Edit entry" : "New entry"}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 600, fontSize: 14, color: "var(--text-h)" }}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Give this entry a title…"
                style={inputStyle(errors.title)}
              />
              {errors.title && <span style={{ fontSize: 12, color: "#ef4444" }}>{errors.title}</span>}
            </div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 600, fontSize: 14, color: "var(--text-h)" }}>Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write whatever's on your mind…"
                rows={8}
                style={{ ...inputStyle(errors.content), resize: "vertical" }}
              />
              {errors.content && <span style={{ fontSize: 12, color: "#ef4444" }}>{errors.content}</span>}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button type="button" variant="outline" onClick={cancelCompose}>
                Cancel
              </Button>
              <Button type="submit">
                {editId ? "Save changes" : "Save entry"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* --- Search --- */}
      {view === "list" && (
        <>
          <div style={{ position: "relative", marginTop: 24, marginBottom: 20 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries…"
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                border: "1.5px solid var(--border)",
                borderRadius: 12,
                fontSize: 14,
                color: "var(--text-h)",
                background: "var(--bg)",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* --- Entry list --- */}
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                border: "1px dashed var(--border)",
                borderRadius: 16,
                color: "var(--text)",
              }}
            >
              {search ? "No entries match your search." : "No entries yet. Start writing!"}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: "20px 22px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          margin: "0 0 4px",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--text-h)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {highlight(entry.title, search)}
                      </h3>
                      <p
                        style={{
                          margin: "0 0 10px",
                          fontSize: 13,
                          color: "var(--text)",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.6,
                        }}
                      >
                        {highlight(entry.content, search)}
                      </p>
                      <span style={{ fontSize: 11, color: "var(--text)", opacity: 0.7 }}>
                        {formatDate(entry.updatedAt || entry.createdAt)}
                        {entry.updatedAt ? " · edited" : ""}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => startEdit(entry)}
                        title="Edit"
                        style={{
                          background: "none",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          padding: "5px 10px",
                          fontSize: 13,
                          cursor: "pointer",
                          color: "var(--text)",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        title="Delete"
                        style={{
                          background: "none",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          padding: "5px 10px",
                          fontSize: 13,
                          cursor: "pointer",
                          color: "var(--text)",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
