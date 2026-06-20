import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Regex Tester",
  description: "Test regex patterns with live match highlighting and capture groups. Free online regex tool.",
});

export default function RegexTesterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
