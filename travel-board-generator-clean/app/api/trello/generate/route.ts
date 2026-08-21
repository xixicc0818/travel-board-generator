import { NextResponse } from "next/server";
import { generateTrelloBoard } from "@/lib/trello";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
    const token = String(body?.token || "");
    const board = body?.board;

    if (!apiKey) return NextResponse.json({ error: "Trello API key is not configured." }, { status: 500 });
    if (!token) return NextResponse.json({ error: "Trello is not connected." }, { status: 401 });
    if (!board?.title || !Array.isArray(board?.lists)) {
      return NextResponse.json({ error: "Invalid travel board data." }, { status: 400 });
    }

    return NextResponse.json({ board: await generateTrelloBoard(board, apiKey, token) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate Trello board." },
      { status: 500 }
    );
  }
}
