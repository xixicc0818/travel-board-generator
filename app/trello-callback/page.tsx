"use client";

import { useEffect } from "react";

export default function TrelloCallback() {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = hash.get("token");
    const error = hash.get("error");

    if (token) {
      sessionStorage.setItem("travel_board_trello_token", token);
      window.location.replace("/");
      return;
    }
    if (error) window.location.replace(`/?trello_error=${encodeURIComponent(error)}`);
  }, []);

  return <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>Connecting Trello…</main>;
}
