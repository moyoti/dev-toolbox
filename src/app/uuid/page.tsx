"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

type Format = "lowercase-hyphen" | "uppercase-hyphen" | "lowercase-no-hyphen" | "uppercase-no-hyphen";

function formatUUID(uuid: string, format: Format): string {
  switch (format) {
    case "lowercase-hyphen":
      return uuid;
    case "uppercase-hyphen":
      return uuid.toUpperCase();
    case "lowercase-no-hyphen":
      return uuid.replace(/-/g, "");
    case "uppercase-no-hyphen":
      return uuid.replace(/-/g, "").toUpperCase();
  }
}

export default function UuidGenerator() {
  const { t } = useI18n();
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<Format>("lowercase-hyphen");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const results: string[] = [];
    const num = Math.min(Math.max(count, 1), 100);
    for (let i = 0; i < num; i++) {
      results.push(generateUUIDv4());
    }
    setUuids(results);
  }, [count]);

  const copySingle = useCallback(
    (uuid: string, index: number) => {
      navigator.clipboard.writeText(formatUUID(uuid, format));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    },
    [format]
  );

  const copyAll = useCallback(() => {
    if (uuids.length === 0) return;
    const text = uuids.map((u) => formatUUID(u, format)).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }, [uuids, format]);

  return (
    <ToolLayout
      titleKey="uuid.title"
      icon="uid"
      descriptionKey="uuid.description"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {t("uuid.count")}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {t("uuid.format")}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs text-foreground"
            >
              <option value="lowercase-hyphen">{t("uuid.lowercaseHyphen")}</option>
              <option value="uppercase-hyphen">{t("uuid.uppercaseHyphen")}</option>
              <option value="lowercase-no-hyphen">{t("uuid.lowercaseNoHyphen")}</option>
              <option value="uppercase-no-hyphen">{t("uuid.uppercaseNoHyphen")}</option>
            </select>
          </div>
          <button
            onClick={generate}
            className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
          >
            {t("common.generate")}
          </button>
        </div>

        {uuids.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {uuids.length} UUID{uuids.length > 1 ? "s" : ""} {t("uuid.generated")}
              </span>
              <button
                onClick={copyAll}
                className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {copiedAll ? t("uuid.allCopied") : t("uuid.copyAll")}
              </button>
            </div>
            <div className="rounded-md border border-border bg-surface-raised p-4">
              <ul className="space-y-1.5">
                {uuids.map((uuid, i) => (
                  <li
                    key={i}
                    className="group flex items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-surface-hover"
                  >
                    <code className="flex-1 font-mono text-sm text-foreground">
                      {formatUUID(uuid, format)}
                    </code>
                    <button
                      onClick={() => copySingle(uuid, i)}
                      className="rounded-sm border border-border bg-surface-raised px-2 py-0.5 font-mono text-[10px] text-muted-foreground opacity-0 transition-all hover:border-accent/40 hover:text-accent group-hover:opacity-100"
                    >
                      {copiedIndex === i ? "✓" : t("common.copy")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
