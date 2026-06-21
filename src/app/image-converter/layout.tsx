import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Image Format Converter",
  description: "Convert images between PNG, JPEG, WebP, BMP, and ICO formats. Free online image converter.",
});

export default function ImageConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
