"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/translations";

const tools = [
  { nameKey: "jsonFormatter.title", href: "/json-formatter", icon: "{ }" },
  { nameKey: "regexTester.title", href: "/regex-tester", icon: ".*" },
  { nameKey: "colorConverter.title", href: "/color-converter", icon: "◆" },
  { nameKey: "base64.title", href: "/base64", icon: "b64" },
  { nameKey: "url.title", href: "/url", icon: "%2" },
  { nameKey: "jwt.title", href: "/jwt", icon: "◉" },
  { nameKey: "timestamp.title", href: "/timestamp", icon: "⏱" },
  { nameKey: "uuid.title", href: "/uuid", icon: "uid" },
  { nameKey: "cron.title", href: "/cron", icon: "⌁" },
  { nameKey: "minifier.title", href: "/minifier", icon: "min" },
  { nameKey: "diff.title", href: "/diff", icon: "±" },
  { nameKey: "httpStatus.title", href: "/http-status", icon: "HTTP" },
  { nameKey: "lorem.title", href: "/lorem", icon: "Lip" },
  { nameKey: "markdown.title", href: "/markdown", icon: "md" },
  { nameKey: "hash.title", href: "/hash", icon: "#" },
  { nameKey: "numberBase.title", href: "/number-base", icon: "0x" },
  { nameKey: "gradient.title", href: "/gradient", icon: "▓" },
  { nameKey: "charCount.title", href: "/char-count", icon: "Aa" },
  { nameKey: "htmlEntities.title", href: "/html-entities", icon: "&amp;" },
  { nameKey: "httpClient.title", href: "/http-client", icon: "API" },
  { nameKey: "websocket.title", href: "/websocket", icon: "WS" },
  { nameKey: "imageCompressor.title", href: "/image-compressor", icon: "img" },
  { nameKey: "imageConverter.title", href: "/image-converter", icon: "⇄" },
  { nameKey: "svgOptimizer.title", href: "/svg-optimizer", icon: "SVG" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t, locale, setLocale } = useI18n();

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-surface text-muted-foreground transition-colors hover:border-accent hover:text-accent lg:hidden"
        aria-label="Toggle navigation"
      >
        <span className="font-mono text-sm">{collapsed ? "×" : "≡"}</span>
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 flex h-full flex-col border-r border-border bg-surface scanlines transition-transform duration-200 lg:translate-x-0 ${
          collapsed ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "var(--sidebar-width)" }}
      >
        <div className="flex h-14 items-center gap-3 border-b border-border px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent/10 font-mono text-xs font-bold text-accent glow-pulse">
            DT
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-foreground">
              {t("sidebar.title")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              v2.0.0
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {t("sidebar.tools")}
          </div>
          <ul className="space-y-0.5">
            {tools.map((tool) => {
              const isActive = pathname === tool.href;
              return (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    onClick={() => setCollapsed(true)}
                    className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "border-l-2 border-accent bg-accent-glow text-accent"
                        : "border-l-2 border-transparent text-muted-foreground hover:border-border hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-surface-raised font-mono text-[11px]">
                      {tool.icon}
                    </span>
                    <span>{t(tool.nameKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border px-5 py-3">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-all ${
              pathname === "/"
                ? "border-l-2 border-accent bg-accent-glow text-accent"
                : "border-l-2 border-transparent text-muted-foreground hover:border-border hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-surface-raised font-mono text-[11px]">
              ⌂
            </span>
            <span>{t("sidebar.dashboard")}</span>
          </Link>
        </div>

        <div className="border-t border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">🌐</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="flex-1 rounded-sm border border-border bg-surface-raised px-2 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent/40 focus:border-accent focus:outline-none"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="ru">Русский</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        <div className="border-t border-border px-5 py-3">
          <p className="font-mono text-[10px] text-muted">
            {t("sidebar.builtWith")}
          </p>
        </div>
      </aside>

      {collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}
    </>
  );
}
