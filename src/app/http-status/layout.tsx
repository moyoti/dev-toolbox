import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "HTTP Status",
  description: "Quick reference for HTTP status codes with search. Browse all standard HTTP status codes. Free online HTTP status reference.",
});

export default function HttpStatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
