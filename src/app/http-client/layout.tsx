import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "HTTP Request Tester",
  description: "Test HTTP requests with method, headers, and body. Lightweight Postman-like tool in your browser. Free online HTTP client.",
});

export default function HttpClientLayout({ children }: { children: React.ReactNode }) {
  return children;
}
