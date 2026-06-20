"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

function parseMarkdown(md: string): string {
  let html = md;

  // Code blocks (```code```)
  html = html.replace(/```([\s\S]*?)```/g, (_match, code: string) => {
    return `<pre class="bg-surface-raised border border-border rounded-md p-3 my-2 overflow-x-auto font-mono text-sm text-foreground">${escapeHtml(code.trim())}</pre>`;
  });

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-bold text-foreground mt-3 mb-1">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-sm font-bold text-foreground mt-3 mb-1">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-base font-bold text-foreground mt-4 mb-1">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-bold text-foreground mt-4 mb-2">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-5 mb-2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-6 mb-3">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="border-border my-4" />');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-2 border-accent pl-3 my-2 text-muted-foreground italic">$1</blockquote>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-surface-raised border border-border rounded-sm px-1.5 py-0.5 font-mono text-xs text-accent">$1</code>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="max-w-full rounded-md my-2" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent underline hover:text-accent-hover">$1</a>');

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="ml-4 list-disc text-foreground">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal text-foreground">$1</li>');

  // Paragraphs - wrap remaining lines
  html = html.replace(/^(?!<[hbluoi]|<hr|<pre|<li|<blockquote|<img|<strong|<em|<code|<\/)(.+)$/gm, '<p class="my-1 text-foreground">$1</p>');

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function MarkdownPreview() {
  const { t } = useI18n();
  const [input, setInput] = useState("# Hello World\n\nThis is a **Markdown** previewer. Try editing this text!\n\n## Features\n\n- Bold **text** and *italic*\n- `Inline code` support\n- [Links](https://example.com)\n\n> This is a blockquote\n\n### Code Block\n\n```\nconst greeting = 'Hello!';\nconsole.log(greeting);\n```\n\n---\n\n1. First item\n2. Second item\n3. Third item\n");

  const rendered = useMemo(() => parseMarkdown(input), [input]);

  return (
    <ToolLayout
      titleKey="markdown.title"
      icon="md"
      descriptionKey="markdown.description"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("markdown.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("markdown.placeholder")}
            className="min-h-[500px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("markdown.preview")}
          </label>
          <div
            className="min-h-[500px] overflow-auto rounded-md border border-border bg-surface-raised p-4 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: rendered || `<span class="text-muted">${t("markdown.placeholder")}</span>` }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
