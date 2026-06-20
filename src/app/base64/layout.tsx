import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Base64 Codec",
  description: "Encode and decode Base64 strings instantly. Free online Base64 encoder and decoder.",
});

export default function Base64Layout({ children }: { children: React.ReactNode }) {
  return children;
}
