import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "SVG Optimizer",
  description: "Optimize SVG files by removing comments, metadata, and redundant data. Free online SVG optimization tool.",
});

export default function SvgOptimizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
