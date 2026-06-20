import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "JWT Decoder",
  description: "Decode and inspect JSON Web Tokens. View header, payload, and signature. Free online JWT decoder.",
});

export default function JwtLayout({ children }: { children: React.ReactNode }) {
  return children;
}
