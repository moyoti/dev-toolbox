import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Number Base Converter",
  description: "Convert numbers between binary, octal, decimal, and hexadecimal. Free online base converter.",
});

export default function NumberBaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
