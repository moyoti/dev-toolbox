import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "HTML Entity Encoder/Decoder",
  description: "Encode and decode HTML entities with reference table. Free online HTML entity tool.",
});

export default function HtmlEntitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
