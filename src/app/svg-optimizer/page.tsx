"use client";

import { useState, useCallback, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

interface OptimizeOptions {
  removeComments: boolean;
  removeMetadata: boolean;
  removeEmptyAttrs: boolean;
  removeDefaults: boolean;
  minify: boolean;
}

const DEFAULT_SVG_ATTRS: Record<string, string> = {
  "fill-rule": "nonzero",
  "clip-rule": "nonzero",
  "stroke-linecap": "butt",
  "stroke-linejoin": "miter",
  "stroke-miterlimit": "4",
  "stroke-dashoffset": "0",
  "stroke-opacity": "1",
  "fill-opacity": "1",
  "font-style": "normal",
  "font-variant": "normal",
  "font-weight": "normal",
  "text-anchor": "start",
  "display": "inline",
  "visibility": "visible",
  "overflow": "visible",
  "xml:space": "default",
  "shape-rendering": "auto",
  "color-rendering": "auto",
  "image-rendering": "auto",
  "text-rendering": "auto",
};

const METADATA_TAGS = ["title", "desc", "metadata", "defs"];

function optimizeSvg(input: string, options: OptimizeOptions): string {
  let svg = input;

  if (options.removeComments) {
    svg = svg.replace(/<!--[\s\S]*?-->/g, "");
  }

  if (options.removeMetadata) {
    for (const tag of METADATA_TAGS) {
      const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
      svg = svg.replace(regex, "");
      const selfClosingRegex = new RegExp(`<${tag}[^>]*\\/?>`, "gi");
      svg = svg.replace(selfClosingRegex, "");
    }
  }

  if (options.removeEmptyAttrs) {
    svg = svg.replace(/\s+([a-zA-Z-]+)=""(?=[\s>])/g, "");
    svg = svg.replace(/\s+([a-zA-Z-]+)='(?=[\s>])/g, "");
  }

  if (options.removeDefaults) {
    for (const [attr, defaultVal] of Object.entries(DEFAULT_SVG_ATTRS)) {
      const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const escapedVal = defaultVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\s+${escapedAttr}=["']${escapedVal}["'](?=[\\s>])`, "g");
      svg = svg.replace(regex, "");
    }
  }

  if (options.minify) {
    svg = svg.replace(/>\s+</g, "><");
    svg = svg.replace(/\s{2,}/g, " ");
    svg = svg.trim();
  } else {
    svg = svg.replace(/>\s+</g, ">\n<");
    svg = svg.trim();
  }

  return svg;
}

export default function SvgOptimizer() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState<OptimizeOptions>({
    removeComments: true,
    removeMetadata: true,
    removeEmptyAttrs: true,
    removeDefaults: false,
    minify: true,
  });
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === "string") {
          setInput(text);
          setOutput("");
          setError("");
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === "string") {
          setInput(text);
          setOutput("");
          setError("");
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const optimize = useCallback(() => {
    setError("");
    if (!input.trim()) {
      setError(t("svgOptimizer.noInput"));
      return;
    }

    if (!input.includes("<svg")) {
      setError(t("svgOptimizer.invalidSvg"));
      return;
    }

    const result = optimizeSvg(input, options);
    setOutput(result);
  }, [input, options, t]);

  const toggleOption = useCallback((key: keyof OptimizeOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const copyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const formatSize = (str: string) => {
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const savingsPercent = inputSize > 0 && outputSize > 0
    ? Math.round((1 - outputSize / inputSize) * 100)
    : 0;

  return (
    <ToolLayout
      titleKey="svgOptimizer.title"
      icon="SVG"
      descriptionKey="svgOptimizer.description"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {([
            ["removeComments", t("svgOptimizer.removeComments")],
            ["removeMetadata", t("svgOptimizer.removeMetadata")],
            ["removeEmptyAttrs", t("svgOptimizer.removeEmptyAttrs")],
            ["removeDefaults", t("svgOptimizer.removeDefaults")],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
                className="rounded-sm border-border bg-surface-raised accent-accent"
              />
              <span className="font-mono text-xs text-muted-foreground">{label}</span>
            </label>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.minify}
                onChange={() => toggleOption("minify")}
                className="rounded-sm border-border bg-surface-raised accent-accent"
              />
              <span className="font-mono text-xs text-muted-foreground">{t("svgOptimizer.minify")}</span>
            </label>
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-md border-2 border-dashed p-4 text-center transition-colors ${
            dragOver ? "border-accent bg-accent/5" : "border-border bg-surface-raised hover:border-accent/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="font-mono text-xs text-muted-foreground" onClick={() => fileInputRef.current?.click()}>
            {t("svgOptimizer.inputPlaceholder")}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("svgOptimizer.input")}
            </label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
              placeholder={t("svgOptimizer.inputPlaceholder")}
              className="min-h-[300px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {t("svgOptimizer.output")}
              </label>
              {output && (
                <div className="flex gap-1">
                  <button
                    onClick={copyOutput}
                    className="rounded-sm border border-border bg-surface-raised px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {t("svgOptimizer.copy")}
                  </button>
                  <button
                    onClick={download}
                    className="rounded-sm border border-border bg-surface-raised px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {t("svgOptimizer.download")}
                  </button>
                </div>
              )}
            </div>
            {error ? (
              <div className="min-h-[300px] rounded-md border border-error/40 bg-error-muted/20 p-4">
                <p className="font-mono text-sm text-error">{error}</p>
              </div>
            ) : (
              <pre className="min-h-[300px] overflow-auto rounded-md border border-border bg-surface-raised p-4 font-mono text-sm leading-relaxed text-foreground">
                {output || `<span class="text-muted">${t("svgOptimizer.noInput")}</span>`}
              </pre>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={optimize}
            className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
          >
            {t("common.format")}
          </button>
        </div>

        {output && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {t("svgOptimizer.originalSize")}
              </p>
              <p className="font-mono text-lg font-bold text-foreground">
                {formatSize(input)}
              </p>
            </div>
            <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {t("svgOptimizer.optimizedSize")}
              </p>
              <p className="font-mono text-lg font-bold text-foreground">
                {formatSize(output)}
              </p>
            </div>
            <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {t("svgOptimizer.savings")}
              </p>
              <p className={`font-mono text-lg font-bold ${savingsPercent > 0 ? "text-success" : "text-warning"}`}>
                {savingsPercent > 0 ? `-${savingsPercent}%` : `${Math.abs(savingsPercent)}%`}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
