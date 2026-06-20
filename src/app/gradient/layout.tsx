import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "CSS Gradient Generator",
  description: "Create beautiful CSS gradients with visual preview. Free online gradient generator.",
});

export default function GradientLayout({ children }: { children: React.ReactNode }) {
  return children;
}
