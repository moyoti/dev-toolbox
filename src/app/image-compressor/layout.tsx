import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Image Compressor",
  description: "Compress images client-side with quality and size control. Free online image compression tool.",
});

export default function ImageCompressorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
