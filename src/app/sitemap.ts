import type { MetadataRoute } from "next";

const BASE_URL = "https://dev-toolbox-zeta-gold.vercel.app";

const tools = [
  "/json-formatter",
  "/regex-tester",
  "/color-converter",
  "/base64",
  "/url",
  "/jwt",
  "/timestamp",
  "/uuid",
  "/cron",
  "/minifier",
  "/diff",
  "/http-status",
  "/lorem",
  "/markdown",
  "/hash",
  "/number-base",
  "/gradient",
  "/char-count",
  "/html-entities",
  "/http-client",
  "/websocket",
  "/image-compressor",
  "/image-converter",
  "/svg-optimizer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolPages,
  ];
}
