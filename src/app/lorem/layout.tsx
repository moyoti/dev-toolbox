import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Lorem Ipsum",
  description: "Generate placeholder text for designs and layouts. Paragraphs, sentences, or words. Free online Lorem Ipsum generator.",
});

export default function LoremLayout({ children }: { children: React.ReactNode }) {
  return children;
}
