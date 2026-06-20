import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata({
  title: "Cron Generator",
  description: "Build and preview cron expressions with human-readable descriptions and next run times. Free online cron expression builder.",
});

export default function CronLayout({ children }: { children: React.ReactNode }) {
  return children;
}
