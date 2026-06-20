import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "URL Codec",
  description: "Encode and decode URL components instantly. Free online URL encoder and decoder.",
});

export default function UrlLayout({ children }: { children: React.ReactNode }) {
  return children;
}
