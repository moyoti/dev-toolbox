import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Color Converter",
  description: "Convert between HEX, RGB, and HSL color formats. Free online color conversion tool.",
});

export default function ColorConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
