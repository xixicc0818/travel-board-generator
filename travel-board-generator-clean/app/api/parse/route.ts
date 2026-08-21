import { NextResponse } from "next/server";
import { parseTripDemo } from "@/lib/demo-parser";

export async function POST(request: Request) {
  const body = await request.json();
  const input = String(body?.input || "").trim();

  if (!input) {
    return NextResponse.json({ error: "Please add some travel information." }, { status: 400 });
  }

  return NextResponse.json({ board: parseTripDemo(input) });
}
