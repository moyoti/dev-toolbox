import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Markdown Preview",
  description: "Write and preview Markdown with real-time rendering. Free online Markdown editor.",
});

export default function MarkdownLayout({ children }: { children: React.ReactNode }) {
  return children;
}
