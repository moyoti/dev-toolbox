import type { Metadata } from "next";

interface ToolMetadata {
  title: string;
  description: string;
}

export function createToolMetadata({ title, description }: ToolMetadata): Metadata {
  return {
    title: `${title} - Dev Toolbox`,
    description,
    openGraph: {
      title: `${title} - Dev Toolbox`,
      description,
      type: "website",
    },
  };
}
