"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type Mode = "encode" | "decode";

const commonEntities: { character: string; entity: string; description: string }[] = [
  { character: "&", entity: "&amp;", description: "Ampersand" },
  { character: "<", entity: "&lt;", description: "Less than" },
  { character: ">", entity: "&gt;", description: "Greater than" },
  { character: '"', entity: "&quot;", description: "Double quote" },
  { character: "'", entity: "&#39;", description: "Single quote / Apostrophe" },
  { character: "©", entity: "&copy;", description: "Copyright" },
  { character: "®", entity: "&reg;", description: "Registered trademark" },
  { character: "™", entity: "&trade;", description: "Trademark" },
  { character: "€", entity: "&euro;", description: "Euro" },
  { character: "£", entity: "&pound;", description: "Pound" },
  { character: "¥", entity: "&yen;", description: "Yen" },
  { character: "¢", entity: "&cent;", description: "Cent" },
  { character: "§", entity: "&sect;", description: "Section" },
  { character: "¶", entity: "&para;", description: "Paragraph" },
  { character: "°", entity: "&deg;", description: "Degree" },
  { character: "±", entity: "&plusmn;", description: "Plus-minus" },
  { character: "×", entity: "&times;", description: "Multiplication" },
  { character: "÷", entity: "&divide;", description: "Division" },
  { character: "←", entity: "&larr;", description: "Left arrow" },
  { character: "→", entity: "&rarr;", description: "Right arrow" },
  { character: "↑", entity: "&uarr;", description: "Up arrow" },
  { character: "↓", entity: "&darr;", description: "Down arrow" },
  { character: "♠", entity: "&spades;", description: "Spade" },
  { character: "♥", entity: "&hearts;", description: "Heart" },
];

function encodeEntities(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeEntities(input: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

export default function HtmlEntities() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (mode === "encode") return encodeEntities(input);
    return decodeEntities(input);
  }, [input, mode]);

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setInput("");
    },
    []
  );

  const copyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  return (
    <ToolLayout
      titleKey="htmlEntities.title"
      icon="&amp;"
      descriptionKey="htmlEntities.description"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange("encode")}
            className={`flex-1 rounded-sm border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              mode === "encode"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface-raised text-muted-foreground hover:border-border-focus hover:text-foreground"
            }`}
          >
            {t("htmlEntities.encodeBtn")}
          </button>
          <button
            onClick={() => handleModeChange("decode")}
            className={`flex-1 rounded-sm border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              mode === "decode"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface-raised text-muted-foreground hover:border-border-focus hover:text-foreground"
            }`}
          >
            {t("htmlEntities.decodeBtn")}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {mode === "encode" ? t("htmlEntities.plainText") : t("htmlEntities.entityText")}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? t("htmlEntities.encodePlaceholder")
                  : t("htmlEntities.decodePlaceholder")
              }
              className="min-h-[280px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {mode === "encode" ? t("htmlEntities.entityText") : t("htmlEntities.plainText")}
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
              placeholder={t("htmlEntities.outputPlaceholder")}
              className="min-h-[280px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("htmlEntities.referenceTable")}
          </span>
          <div className="mt-3 overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 text-left font-mono text-[10px] uppercase tracking-wider text-muted">
                    {t("htmlEntities.character")}
                  </th>
                  <th className="py-2 pr-4 text-left font-mono text-[10px] uppercase tracking-wider text-muted">
                    {t("htmlEntities.entity")}
                  </th>
                  <th className="py-2 pr-4 text-left font-mono text-[10px] uppercase tracking-wider text-muted">
                    {t("htmlEntities.result")}
                  </th>
                  <th className="py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted">
                    {t("htmlEntities.entityDesc")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {commonEntities.map((entry) => (
                  <tr key={entry.entity} className="border-b border-border/30 hover:bg-surface-hover">
                    <td className="py-1.5 pr-4 font-mono text-sm text-accent">{entry.character}</td>
                    <td className="py-1.5 pr-4 font-mono text-xs text-foreground">{entry.entity}</td>
                    <td className="py-1.5 pr-4 font-mono text-sm text-muted-foreground">{entry.character}</td>
                    <td className="py-1.5 text-xs text-muted-foreground">{entry.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
