import { useEffect, useState } from "react";
import ChatWidget from "./components/ChatWidget";
import { defaultFaqs } from "./data/faqs";

export default function App() {
  // Basic theme/colors to match Iron Lady - tweak hexes as needed
  const brand = {
    primary: "#b31e5b", // example accent (change to exact brand color)
    surface: "#ffffff",
    bg: "#f6f4f8",
    text: "#222"
  };

  return (
    <div style={{ minHeight: "100vh", background: brand.bg, padding: 24 }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 8, background: brand.primary,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700
          }}>
            IL
          </div>
          <div>
            <h1 style={{ margin: 0, color: brand.text }}>Iron Lady — Assistant</h1>
            <p style={{ margin: 0, color: "#555" }}>Get answers about leadership programs</p>
          </div>
        </header>

        <main style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 24
        }}>
          <section style={{ padding: 18, background: "#fff", borderRadius: 12, boxShadow: "0 8px 20px rgba(26,24,32,0.04)" }}>
            <h2 style={{ marginTop: 0 }}>Overview</h2>
            <p style={{ color: "#333" }}>
              Build quick FAQ chatbot and show how it matches Iron Lady’s style. Use the chat widget on the right to try it out.
            </p>

            <div style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 8 }}>Sample FAQs</h3>
              <ul style={{ marginTop: 0 }}>
                {Object.keys(defaultFaqs).map((k) => (
                  <li key={k} style={{ color: "#444" }}>{k}</li>
                ))}
              </ul>
            </div>
          </section>

          <aside>
            <ChatWidget brand={brand} faqs={defaultFaqs} />
          </aside>
        </main>
      </div>
    </div>
  );
}
