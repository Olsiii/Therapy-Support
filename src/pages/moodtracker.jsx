import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

const STORAGE_KEY = "ts_mood_entries";

const EMOTION_TAGS = [
  { id: "happy", label: "😊 Happy" },
  { id: "calm", label: "😌 Calm" },
  { id: "anxious", label: "😰 Anxious" },
  { id: "tired", label: "😴 Tired" },
  { id: "sad", label: "😢 Sad" },
  { id: "angry", label: "😤 Angry" },
  { id: "hopeful", label: "🌟 Hopeful" },
  { id: "overwhelmed", label: "🤯 Overwhelmed" },
];

function getMoodLabel(score) {
  if (score <= 2) return { text: "Very Low", color: "#ef4444" };
  if (score <= 4) return { text: "Low", color: "#f97316" };
  if (score <= 6) return { text: "Moderate", color: "#eab308" };
  if (score <= 8) return { text: "Good", color: "#22c55e" };
  return { text: "Excellent", color: "#8b5cf6" };
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MoodTracker() {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [score, setScore] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const toggleEmotion = (id) => {
    setSelectedEmotions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      score,
      emotions: selectedEmotions,
      note: note.trim(),
    };
    setEntries((prev) => [entry, ...prev]);
    setScore(5);
    setSelectedEmotions([]);
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const moodInfo = getMoodLabel(score);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-h)", marginBottom: 4 }}>
        Mood Tracker
      </h1>
      <p style={{ color: "var(--text)", marginBottom: 32 }}>
        Check in with yourself daily. How are you feeling?
      </p>

      {/* --- Log Form --- */}
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "32px",
          marginBottom: 40,
          boxShadow: "var(--shadow)",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Score slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontWeight: 600, color: "var(--text-h)", fontSize: 15 }}>
                Mood score
              </label>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: moodInfo.color,
                  minWidth: 80,
                  textAlign: "right",
                }}
              >
                {score}/10 &nbsp;
                <span style={{ fontSize: 14, fontWeight: 500, color: moodInfo.color }}>
                  {moodInfo.text}
                </span>
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              style={{
                width: "100%",
                height: 6,
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text)" }}>
              <span>1 – Very Low</span>
              <span>10 – Excellent</span>
            </div>
          </div>

          {/* Emotion tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontWeight: 600, color: "var(--text-h)", fontSize: 15 }}>
              How are you feeling? <span style={{ fontWeight: 400, color: "var(--text)" }}>(pick any)</span>
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EMOTION_TAGS.map(({ id, label }) => {
                const active = selectedEmotions.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleEmotion(id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      background: active ? "var(--accent-bg)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text)",
                      fontWeight: active ? 600 : 400,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontWeight: 600, color: "var(--text-h)", fontSize: 15 }}>
              Note <span style={{ fontWeight: 400, color: "var(--text)" }}>(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind today?"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid var(--border)",
                borderRadius: 12,
                fontSize: 14,
                color: "var(--text-h)",
                background: "var(--bg)",
                resize: "vertical",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button type="submit" size="lg" style={{ minWidth: 140 }}>
              Log mood
            </Button>
            {saved && (
              <span style={{ color: "#22c55e", fontSize: 14, fontWeight: 500 }}>
                ✅ Mood logged!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* --- History --- */}
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-h)", marginBottom: 16 }}>
        History
      </h2>

      {entries.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            border: "1px dashed var(--border)",
            borderRadius: 16,
            color: "var(--text)",
          }}
        >
          No entries yet. Log your first mood above!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((entry) => {
            const info = getMoodLabel(entry.score);
            return (
              <div
                key={entry.id}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "18px 22px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                {/* Score badge */}
                <div
                  style={{
                    minWidth: 52,
                    height: 52,
                    borderRadius: 14,
                    background: info.color + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: 18, color: info.color, lineHeight: 1 }}>
                    {entry.score}
                  </span>
                  <span style={{ fontSize: 10, color: info.color, fontWeight: 600 }}>/10</span>
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: info.color, fontSize: 14 }}>
                      {info.text}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text)" }}>
                      {formatDate(entry.date)}
                    </span>
                  </div>

                  {entry.emotions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: entry.note ? 8 : 0 }}>
                      {entry.emotions.map((id) => {
                        const tag = EMOTION_TAGS.find((t) => t.id === id);
                        return (
                          <span
                            key={id}
                            style={{
                              fontSize: 12,
                              padding: "2px 10px",
                              borderRadius: 999,
                              background: "var(--accent-bg)",
                              color: "var(--accent)",
                              fontWeight: 500,
                            }}
                          >
                            {tag?.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {entry.note && (
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                      {entry.note}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteEntry(entry.id)}
                  title="Delete entry"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text)",
                    fontSize: 16,
                    cursor: "pointer",
                    padding: "4px",
                    opacity: 0.4,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
