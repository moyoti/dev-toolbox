import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "WebSocket Client",
  description: "Connect, send, and receive WebSocket messages in real-time. Free online WebSocket testing tool.",
});

export default function WebsocketLayout({ children }: { children: React.ReactNode }) {
  return children;
}
