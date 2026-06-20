import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Timestamp",
  description: "Convert between Unix timestamps and human-readable dates. Free online timestamp converter.",
});

export default function TimestampLayout({ children }: { children: React.ReactNode }) {
  return children;
}
