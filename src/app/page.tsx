"use client";

import Sidebar from "@/components/Sidebar";

const tools = [
  { name: "JSON Formatter", href: "/json-formatter", icon: "{ }", desc: "Format, minify, and validate JSON with syntax highlighting" },
  { name: "Regex Tester", href: "/regex-tester", icon: ".*", desc: "Test regex patterns with live match highlighting and groups" },
  { name: "Color Converter", href: "/color-converter", icon: "◆", desc: "Convert between HEX, RGB, and HSL color formats" },
  { name: "Base64 Codec", href: "/base64", icon: "b64", desc: "Encode and decode Base64 strings instantly" },
  { name: "URL Codec", href: "/url", icon: "%2", desc: "Encode and decode URL components instantly" },
  { name: "JWT Decoder", href: "/jwt", icon: "◉", desc: "Decode and inspect JSON Web Tokens" },
  { name: "Timestamp", href: "/timestamp", icon: "⏱", desc: "Convert between Unix timestamps and human-readable dates" },
  { name: "UUID Generator", href: "/uuid", icon: "uid", desc: "Generate random UUID v4 identifiers" },
  { name: "Cron Generator", href: "/cron", icon: "⌁", desc: "Build and preview cron expressions with human-readable descriptions" },
  { name: "Code Minifier", href: "/minifier", icon: "min", desc: "Minify HTML, CSS, and JavaScript code" },
  { name: "Diff Compare", href: "/diff", icon: "±", desc: "Compare two texts side-by-side with diff highlighting" },
  { name: "HTTP Status", href: "/http-status", icon: "HTTP", desc: "Quick reference for HTTP status codes with search" },
  { name: "Lorem Ipsum", href: "/lorem", icon: "Lip", desc: "Generate placeholder text for designs and layouts" },
];

export default function Home() {
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
                Developer Workshop
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h1 className="text-center font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              DEV <span className="text-accent">TOOLBOX</span>
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Essential tools, always within reach. No API keys, no sign-ups, no nonsense.
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
                    {tool.name.toUpperCase()}
                  </h2>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {tool.desc}
                </p>
                <div className="mt-auto flex items-center gap-1 font-mono text-[10px] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  <span>OPEN</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>

          <footer className="mt-16 border-t border-border pt-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              All tools run client-side · No data leaves your browser
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
