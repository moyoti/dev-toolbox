import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Character & Word Counter",
  description: "Count characters, words, sentences, and analyze text density. Free online text analyzer.",
});

export default function CharCountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
