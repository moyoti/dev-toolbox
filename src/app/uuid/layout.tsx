import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "UUID Generator",
  description: "Generate random UUID v4 identifiers. Bulk generate with format options. Free online UUID generator.",
});

export default function UuidLayout({ children }: { children: React.ReactNode }) {
  return children;
}
