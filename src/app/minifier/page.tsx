"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type Lang = "html" | "css" | "js";

function minifyHtml(input: string): string {
  let result = input;
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  result = result.replace(/>\s+</g, "><");
  result = result.replace(/\s{2,}/g, " ");
  result = result.replace(/^\s+|\s+$/gm, "");
  result = result.replace(/\n/g, "");
  return result.trim();
}

function minifyCss(input: string): string {
  let result = input;
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result.replace(/\s{2,}/g, " ");
  result = result.replace(/\s*([{}:;,])\s*/g, "$1");
  result = result.replace(/;\}/g, "}");
  result = result.replace(/^\s+|\s+$/gm, "");
  result = result.replace(/\n/g, "");
  return result.trim();
}

function minifyJs(input: string): string {
  let result = input;
  result = result.replace(/\/\/.*$/gm, "");
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result.replace(/\s{2,}/g, " ");
  result = result.replace(/^\s+|\s+$/gm, "");
  result = result.replace(/\n+/g, "\n");
  const lines = result.split("\n").filter((line) => line.trim() !== "");
  return lines.join(" ").trim();
}

export default function CodeMinifier() {
  const { t } = useI18n();
  const [lang, setLang] = useState<Lang>("html");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    switch (lang) {
      case "html":
        setOutput(minifyHtml(input));
        break;
      case "css":
        setOutput(minifyCss(input));
        break;
      case "js":
        setOutput(minifyJs(input));
        break;
    }
  }, [input, lang]);

  const copyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;
  const savings = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;

  return (
    <ToolLayout
      titleKey="minifier.title"
      icon="min"
      descriptionKey="minifier.description"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["html", "css", "js"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setInput("");
                setOutput("");
              }}
              className={`flex-1 rounded-sm border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                lang === l
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface-raised text-muted-foreground hover:border-border-focus hover:text-foreground"
              }`}
            >
              {l === "js" ? "JavaScript" : l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("minifier.inputLabel")} ({lang.toUpperCase()})
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("minifier.inputPlaceholder")}
              className="min-h-[300px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={minify}
                className="flex-1 rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
              >
                {t("common.minify")}
              </button>
              <button
                onClick={() => {
                  setInput("");
                  setOutput("");
                }}
                className="rounded-sm border border-border bg-surface-raised px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-error/40 hover:text-error"
              >
                {t("common.clear")}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {t("minifier.minifiedOutput")}
              </label>
              {output && (
                <button
                  onClick={copyOutput}
                  className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {copied ? t("common.copied") : t("common.copy")}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder={t("minifier.outputPlaceholder")}
              className="min-h-[300px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>

        {output && (
          <div className="flex items-center gap-4 rounded-md border border-border bg-surface p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {t("common.stats")}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {t("minifier.originalSize")}: {originalSize} {t("common.bytes")}
            </span>
            <span className="text-border">|</span>
            <span className="font-mono text-xs text-muted-foreground">
              {t("minifier.minifiedSize")}: {minifiedSize} {t("common.bytes")}
            </span>
            <span className="text-border">|</span>
            <span className="font-mono text-xs text-success">
              {savings}% {t("common.saved")}
            </span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
