import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "JSON Formatter",
  description: "Format, minify, and validate JSON with syntax highlighting. Free online JSON tool.",
});

export default function JsonFormatterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
