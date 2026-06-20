import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Code Minifier",
  description: "Minify HTML, CSS, and JavaScript code. Reduce file size with regex-based minification. Free online code minifier.",
});

export default function MinifierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
