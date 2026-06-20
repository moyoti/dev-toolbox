import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Diff Compare",
  description: "Compare two texts side-by-side with diff highlighting. Free online text diff tool.",
});

export default function DiffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
