"use client";

import { useEffect, useState } from "react";
import type { TravelBoard } from "@/lib/types";

const sample = `Prague 2026/09/05 - 2026/09/10
BR123 Taipei → Prague
Hotel: Žižkov, check-in 15:00
09/06 Old Town + coffee
09/07 train to Děčín 12:30
09/08 Bohemian Switzerland`;

export default function Home() {
  const [input, setInput] = useState(sample);
  const [board, setBoard] = useState<TravelBoard | null>(null);
  const [busy, setBusy] = useState(false);
  const [trelloConnected, setTrelloConnected] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTrelloConnected(Boolean(sessionStorage.getItem("travel_board_trello_token")));
  }, []);

  async function parseTrip() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setBoard(data.board);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to parse trip.");
    } finally {
      setBusy(false);
    }
  }

  function connectTrello() {
    const key = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    if (!key) {
      setMessage("Add NEXT_PUBLIC_TRELLO_API_KEY first.");
      return;
    }
    const url = new URL("https://trello.com/1/authorize");
    url.searchParams.set("expiration", "1day");
    url.searchParams.set("scope", "read,write");
    url.searchParams.set("response_type", "token");
    url.searchParams.set("key", key);
    url.searchParams.set("return_url", `${appUrl}/trello-callback`);
    url.searchParams.set("callback_method", "fragment");
    url.searchParams.set("name", "Travel Board Generator");
    window.location.href = url.toString();
  }

  async function generateBoard() {
    if (!board) return;
    const token = sessionStorage.getItem("travel_board_trello_token");
    if (!token) {
      connectTrello();
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/trello/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board, token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage(`READY:${data.board.url}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create Trello board.");
    } finally {
      setBusy(false);
    }
  }

  const readyUrl = message.startsWith("READY:") ? message.replace("READY:", "") : "";

  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand">Travel Board Generator</div>
        <div className="badge">v0.1 · MVP</div>
      </nav>

      <section className="hero">
        <div>
          <div className="eyebrow">Chemical Hype Boy · Tools</div>
          <h1>Messy trip in. Clean Trello board out.</h1>
        </div>
        <div>
          <p>Paste flights, hotels, transport and plans. Preview the structure, then generate a travel-ready Trello board.</p>
          <div className="steps">
            <span>01 Add trip</span><span>02 Preview</span><span>03 Connect Trello</span><span>04 Generate</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel">
          <h2>1. Add your travel information</h2>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} />
          <div className="actions">
            <button className="primary" onClick={parseTrip} disabled={busy || !input.trim()}>
              {busy ? "Working…" : "Build preview"}
            </button>
            <button className="secondary" onClick={() => setInput("")}>Clear</button>
          </div>
          {!board && <div className="status">v0.1 accepts pasted text. Files and screenshots come next.</div>}
        </div>

        <div className="panel">
          <div className="preview-head">
            <div>
              <h2>2. Board preview</h2>
              <div className="preview-title">{board?.title || "Nothing generated yet"}</div>
            </div>
            {board && <div className="badge">{board.lists.reduce((n, l) => n + l.cards.length, 0)} cards</div>}
          </div>

          <div className="board">
            {board ? board.lists.map((list) => (
              <div className="list" key={list.title}>
                <div className="list-title">{list.title}</div>
                {list.cards.map((card, index) => (
                  <div className="card" key={`${card.title}-${index}`}>{card.title}</div>
                ))}
              </div>
            )) : (
              <div className="muted">Your board structure will appear here before anything is sent to Trello.</div>
            )}
          </div>

          <div className="actions">
            <button className="secondary" onClick={connectTrello}>
              {trelloConnected ? "Trello connected" : "Connect Trello"}
            </button>
            <button className="primary" disabled={!board || busy} onClick={generateBoard}>
              Generate Trello Board
            </button>
          </div>

          {readyUrl ? (
            <div className="status success">Board created. <a href={readyUrl} target="_blank">Open in Trello ↗</a></div>
          ) : message ? (
            <div className="status error">{message}</div>
          ) : (
            <div className="status">No payment in v0.1. Paywall comes after the core workflow is validated.</div>
          )}
        </div>
      </section>

      <footer className="footer">
        Travel Board Generator · A small utility for people who already planned the trip and just need everything organized.
      </footer>
    </main>
  );
}
