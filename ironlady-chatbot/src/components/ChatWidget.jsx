import { useEffect, useRef, useState } from "react";

/**
 * Simple chat widget:
 * - faqs: object of { key: answer }
 * - brand: { primary, surface, bg, text }
 */
export default function ChatWidget({ brand, faqs }) {
  const [name, setName] = useState(() => localStorage.getItem("il_name") || "");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("il_chat");
      return raw ? JSON.parse(raw) : [
        { id: Date.now(), from: "bot", text: "Hi — I'm Iris, your Iron Lady assistant. What's your name?" }
      ];
    } catch {
      return [];
    }
  });
  const [showNamePrompt, setShowNamePrompt] = useState(!name);
  const containerRef = useRef();

  useEffect(() => {
    localStorage.setItem("il_chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("il_name", name);
  }, [name]);

  useEffect(() => {
    // auto-scroll
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const pushBot = (text) => {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), from: "bot", text }]);
  };

  const handleSend = (textToSend) => {
    const text = textToSend?.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Date.now() + Math.random(), from: "user", text }]);
    setInput("");

    // simple matching (keyword in text) - case insensitive
    const q = text.toLowerCase();
    // if user gives name, store it and greet
    if (!name && /my name is|i am|call me|name is /i.test(q)) {
      const matched = text.split(" ").slice(-1)[0];
      const extracted = matched.replace(/[^\w]/g, "");
      const finalName = extracted || text;
      setName(finalName);
      setTimeout(() => pushBot(`Nice to meet you, ${finalName}! How can I help with Iron Lady programs?`), 600);
      return;
    }

    // check prebuilt faqs
    let answered = false;
    for (const key of Object.keys(faqs)) {
      if (q.includes(key.toLowerCase())) {
        answered = true;
        setTimeout(() => pushBot(faqs[key]), 600);
        break;
      }
    }
    if (!answered) {
      // friendly fallback
      setTimeout(() => pushBot("Sorry, I don't have that exact info right now. Would you like me to connect you to a mentor or share program links?"), 700);
    }
  };

  const quickChips = ["Duration", "Mode", "Certification", "Mentors", "Program details"];

  return (
    <div style={{
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 12px 40px rgba(18,18,20,0.06)"
    }}>
      <div style={{ background: brand.primary, color: "#fff", padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>I</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Iris — Iron Lady Assistant</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Ask about leadership programs</div>
        </div>
      </div>

      <div style={{ height: 420, display: "flex", flexDirection: "column", background: "#fff" }}>
        <div ref={containerRef} style={{ flex: 1, padding: 12, overflowY: "auto" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", marginBottom: 12, justifyContent: m.from === "bot" ? "flex-start" : "flex-end" }}>
              {m.from === "bot" && (
                <div style={{
                  maxWidth: "78%",
                  background: "#f3f3f5",
                  padding: "10px 12px",
                  borderRadius: "12px 12px 12px 4px",
                  color: "#222",
                  boxShadow: "0 6px 18px rgba(18,18,30,0.02)"
                }}>
                  <div style={{ fontSize: 14, lineHeight: 1.35 }}>{m.text}</div>
                </div>
              )}

              {m.from === "user" && (
                <div style={{
                  maxWidth: "78%",
                  background: brand.primary,
                  color: "#fff",
                  padding: "10px 12px",
                  borderRadius: "12px 12px 4px 12px",
                }}>
                  <div style={{ fontSize: 14, lineHeight: 1.35 }}>{m.text}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderTop: "1px solid #eee", background: "#fff" }}>
          {showNamePrompt && (
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#333" }}>Your name (optional)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type your name..."
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                />
                <button onClick={() => setShowNamePrompt(false)} style={{ padding: "8px 12px", background: brand.primary, color: "#fff", border: "none", borderRadius: 8 }}>
                  Save
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                You can skip and chat anonymously.
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {quickChips.map((c) => (
              <button key={c} onClick={() => handleSend(c)} style={{
                padding: "6px 10px", borderRadius: 999, border: "1px solid #eee",
                background: "#fafafa", cursor: "pointer", fontSize: 13
              }}>{c}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
              placeholder={name ? `Hi ${name}, ask anything about programs...` : `Ask about program duration, mentors, or certification...`}
              style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #eee" }}
            />
            <button onClick={() => handleSend(input)} style={{ padding: "10px 14px", background: brand.primary, color: "#fff", border: "none", borderRadius: 10 }}>
              Send
            </button>
            <button onClick={() => { setMessages([]); setName(""); localStorage.removeItem("il_chat"); localStorage.removeItem("il_name"); setShowNamePrompt(true); }} title="Reset" style={{ padding: "10px 10px", borderRadius: 10, border: "1px solid #eee", background: "#fff" }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", padding: 10, textAlign: "center", borderTop: "1px solid #f0f0f0", fontSize: 12 }}>
        <span style={{ color: "#666" }}>Built with ❤️ for Iron Lady — local demo</span>
      </div>
    </div>
  );
}
