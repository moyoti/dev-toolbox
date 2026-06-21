"use client";

import Sidebar from "@/components/Sidebar";
import { useI18n } from "@/lib/i18n";

const tools = [
  { nameKey: "jsonFormatter.title", href: "/json-formatter", icon: "{ }", descKey: "jsonFormatter.description" },
  { nameKey: "regexTester.title", href: "/regex-tester", icon: ".*", descKey: "regexTester.description" },
  { nameKey: "colorConverter.title", href: "/color-converter", icon: "◆", descKey: "colorConverter.description" },
  { nameKey: "base64.title", href: "/base64", icon: "b64", descKey: "base64.description" },
  { nameKey: "url.title", href: "/url", icon: "%2", descKey: "url.description" },
  { nameKey: "jwt.title", href: "/jwt", icon: "◉", descKey: "jwt.description" },
  { nameKey: "timestamp.title", href: "/timestamp", icon: "⏱", descKey: "timestamp.description" },
  { nameKey: "uuid.title", href: "/uuid", icon: "uid", descKey: "uuid.description" },
  { nameKey: "cron.title", href: "/cron", icon: "⌁", descKey: "cron.description" },
  { nameKey: "minifier.title", href: "/minifier", icon: "min", descKey: "minifier.description" },
  { nameKey: "diff.title", href: "/diff", icon: "±", descKey: "diff.description" },
  { nameKey: "httpStatus.title", href: "/http-status", icon: "HTTP", descKey: "httpStatus.description" },
  { nameKey: "lorem.title", href: "/lorem", icon: "Lip", descKey: "lorem.description" },
  { nameKey: "markdown.title", href: "/markdown", icon: "md", descKey: "markdown.description" },
  { nameKey: "hash.title", href: "/hash", icon: "#", descKey: "hash.description" },
  { nameKey: "numberBase.title", href: "/number-base", icon: "0x", descKey: "numberBase.description" },
  { nameKey: "gradient.title", href: "/gradient", icon: "▓", descKey: "gradient.description" },
  { nameKey: "charCount.title", href: "/char-count", icon: "Aa", descKey: "charCount.description" },
  { nameKey: "htmlEntities.title", href: "/html-entities", icon: "&amp;", descKey: "htmlEntities.description" },
  { nameKey: "httpClient.title", href: "/http-client", icon: "API", descKey: "httpClient.description" },
  { nameKey: "websocket.title", href: "/websocket", icon: "WS", descKey: "websocket.description" },
  { nameKey: "imageCompressor.title", href: "/image-compressor", icon: "img", descKey: "imageCompressor.description" },
  { nameKey: "imageConverter.title", href: "/image-converter", icon: "⇄", descKey: "imageConverter.description" },
  { nameKey: "svgOptimizer.title", href: "/svg-optimizer", icon: "SVG", descKey: "svgOptimizer.description" },
];

export default function Home() {
  const { t, locale } = useI18n();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className="flex-1 lg:ml-[var(--sidebar-width)]"
      >
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
          <header className="mb-14">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                {t("home.workshop")}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h1 className="text-center font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              {locale === "zh" ? (
                <>{t("home.title")}</>
              ) : (
                <>DEV <span className="text-accent">TOOLBOX</span></>
              )}
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {t("home.subtitle")}
            </p>
            <div className="mx-auto mt-6 h-px max-w-xs bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <a
                key={tool.href}
                href={tool.href}
                className="animate-slide-up group relative flex flex-col gap-3 rounded-md border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:bg-surface-raised"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute -top-px -right-px h-3 w-3 border-t border-r border-accent/30 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-accent/30 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent/10 font-mono text-sm font-bold text-accent transition-colors group-hover:bg-accent/20">
                    {tool.icon}
                  </div>
                  <h2 className="font-mono text-sm font-semibold tracking-wide text-foreground">
                    {locale === "zh" ? t(tool.nameKey) : t(tool.nameKey).toUpperCase()}
                  </h2>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t(tool.descKey)}
                </p>
                <div className="mt-auto flex items-center gap-1 font-mono text-[10px] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  <span>{t("common.open")}</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>

          <footer className="mt-16 border-t border-border pt-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {t("home.footer")}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
