import type { TravelBoard } from "./types";

export function parseTripDemo(input: string): TravelBoard {
  const lines = input.split("\n").map((line) => line.trim()).filter(Boolean);
  const destination =
    lines.find((line) => /東京|大阪|首爾|布拉格|台北|Tokyo|Seoul|Prague|Osaka/i.test(line)) ||
    "My Trip";
  const dateMatches = input.match(/20\d{2}[\/.-]\d{1,2}[\/.-]\d{1,2}|\d{1,2}[\/.-]\d{1,2}/g) || [];
  const normalizedTitle = destination.replace(/[｜|].*$/, "").trim();

  const essentials = [
    {
      title: "Flight & Transportation",
      note: lines.filter((line) => /航班|飛機|機票|BR\d+|CI\d+|flight|train|火車|車票/i.test(line)).join("\n") || "Add flight or transportation details.",
    },
    {
      title: "Accommodation",
      note: lines.filter((line) => /住宿|飯店|hotel|airbnb|bnb|check.?in|check.?out/i.test(line)).join("\n") || "Add accommodation details.",
    },
  ];

  const activityLines = lines.filter(
    (line) => !/航班|飛機|機票|BR\d+|CI\d+|flight|住宿|飯店|hotel|airbnb|bnb/i.test(line)
  );

  return {
    title: `${normalizedTitle} Travel Board`,
    destination: normalizedTitle,
    startDate: dateMatches[0],
    endDate: dateMatches[dateMatches.length - 1],
    lists: [
      { title: "Before You Go", cards: essentials },
      {
        title: dateMatches[0] ? `Day 1｜${dateMatches[0]}` : "Day 1",
        cards: activityLines.length ? activityLines.slice(0, 8).map((line) => ({ title: line })) : [{ title: "Add your first activity" }],
      },
    ],
  };
}
