"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type Mode = "encode" | "decode";

export default function UrlCodec() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const process = useCallback(
    (value: string, currentMode: Mode) => {
      setError("");
      if (!value.trim()) {
        setOutput("");
        return;
      }
      try {
        if (currentMode === "encode") {
          setOutput(encodeURIComponent(value));
        } else {
          setOutput(decodeURIComponent(value));
        }
      } catch {
        setError(currentMode === "encode" ? t("url.encodeFailed") : t("url.decodeFailed"));
        setOutput("");
      }
    },
    [t]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      process(value, mode);
    },
    [mode, process]
  );

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setInput("");
      setOutput("");
      setError("");
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
      titleKey="url.title"
      icon="%2"
      descriptionKey="url.description"
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
            {t("url.encodeBtn")}
          </button>
          <button
            onClick={() => handleModeChange("decode")}
            className={`flex-1 rounded-sm border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              mode === "decode"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface-raised text-muted-foreground hover:border-border-focus hover:text-foreground"
            }`}
          >
            {t("url.decodeBtn")}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {mode === "encode" ? t("url.plainText") : t("url.encodedString")}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={
                mode === "encode"
                  ? t("url.encodePlaceholder")
                  : t("url.decodePlaceholder")
              }
              className="min-h-[280px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {mode === "encode" ? t("url.encodedOutput") : t("url.decodedText")}
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
            {error ? (
              <div className="min-h-[280px] rounded-md border border-error/40 bg-error-muted/20 p-4">
                <p className="font-mono text-sm text-error/80">{error}</p>
              </div>
            ) : (
              <textarea
                value={output}
                readOnly
                placeholder={t("url.outputPlaceholder")}
                className="min-h-[280px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:outline-none"
              />
            )}
          </div>
        </div>

        {output && (
          <div className="flex items-center gap-4 rounded-md border border-border bg-surface p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {t("common.stats")}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {t("url.inputChars")}: {input.length} {t("common.chars")}
            </span>
            <span className="text-border">|</span>
            <span className="font-mono text-xs text-muted-foreground">
              {t("url.outputChars")}: {output.length} {t("common.chars")}
            </span>
            <span className="text-border">|</span>
            <span className="font-mono text-xs text-accent">
              {mode === "encode"
                ? `${Math.round((output.length / input.length) * 100)}% ${t("common.size")}`
                : `${Math.round((output.length / input.length) * 100)}% ${t("common.recovered")}`}
            </span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
