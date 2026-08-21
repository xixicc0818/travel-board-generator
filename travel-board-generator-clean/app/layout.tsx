import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Board Generator",
  description: "Turn messy travel plans into one clean Trello board.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
