import type { TravelBoard } from "./types";

const API_BASE = "https://api.trello.com/1";

async function trelloFetch(path: string, params: Record<string, string>) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url.toString(), { method: "POST" });
  if (!response.ok) throw new Error(`Trello API ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function generateTrelloBoard(board: TravelBoard, apiKey: string, token: string) {
  const createdBoard = await trelloFetch("/boards/", {
    name: board.title, defaultLists: "false", key: apiKey, token
  });

  for (const list of board.lists) {
    const createdList = await trelloFetch("/lists", {
      name: list.title, idBoard: createdBoard.id, pos: "bottom", key: apiKey, token
    });

    for (const card of list.cards) {
      const description = [
        card.time && `Time: ${card.time}`,
        card.location && `Location: ${card.location}`,
        card.address && `Address: ${card.address}`,
        card.note && card.note,
        card.source && `Source: ${card.source}`,
      ].filter(Boolean).join("\n\n");

      await trelloFetch("/cards", {
        name: card.title, idList: createdList.id, desc: description, pos: "bottom", key: apiKey, token
      });
    }
  }

  return { id: createdBoard.id, url: createdBoard.url, name: createdBoard.name };
}
