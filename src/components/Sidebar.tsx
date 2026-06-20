"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const tools = [
  { name: "JSON Formatter", href: "/json-formatter", icon: "{ }" },
  { name: "Regex Tester", href: "/regex-tester", icon: ".*" },
  { name: "Color Converter", href: "/color-converter", icon: "◆" },
  { name: "Base64 Codec", href: "/base64", icon: "b64" },
  { name: "URL Codec", href: "/url", icon: "%2" },
  { name: "JWT Decoder", href: "/jwt", icon: "◉" },
  { name: "Timestamp", href: "/timestamp", icon: "⏱" },
  { name: "UUID Generator", href: "/uuid", icon: "uid" },
  { name: "Cron Generator", href: "/cron", icon: "⌁" },
  { name: "Code Minifier", href: "/minifier", icon: "min" },
  { name: "Diff Compare", href: "/diff", icon: "±" },
  { name: "HTTP Status", href: "/http-status", icon: "HTTP" },
  { name: "Lorem Ipsum", href: "/lorem", icon: "Lip" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
              DEV TOOLBOX
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              v2.0.0
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Tools
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
                    <span>{tool.name}</span>
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
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="border-t border-border px-5 py-3">
          <p className="font-mono text-[10px] text-muted">
            Built with Next.js + Tailwind
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
