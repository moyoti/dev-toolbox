import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Hash Generator",
  description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text. Free online hash generator.",
});

export default function HashLayout({ children }: { children: React.ReactNode }) {
  return children;
}
