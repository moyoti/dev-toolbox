"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type Base = 2 | 8 | 10 | 16;

const baseLabels: Record<Base, string> = {
  2: "BIN",
  8: "OCT",
  10: "DEC",
  16: "HEX",
};

export default function NumberBaseConverter() {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [inputBase, setInputBase] = useState<Base>(10);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const conversions = useMemo(() => {
    if (!inputValue.trim()) return null;
    setError("");

    const cleaned = inputValue.trim().toUpperCase();

    let bigInt: bigint;
    try {
      if (cleaned.startsWith("0X") && inputBase === 16) {
        bigInt = BigInt(cleaned);
      } else if (cleaned.startsWith("0B") && inputBase === 2) {
        bigInt = BigInt(cleaned);
      } else if (cleaned.startsWith("0O") && inputBase === 8) {
        bigInt = BigInt(cleaned);
      } else {
        const prefix = inputBase === 16 ? "0x" : inputBase === 8 ? "0o" : inputBase === 2 ? "0b" : "";
        bigInt = BigInt(prefix + cleaned);
      }
    } catch {
      setError(t("numberBase.invalidNumber"));
      return null;
    }

    if (bigInt < BigInt(0)) {
      setError(t("numberBase.invalidNumber"));
      return null;
    }

    return {
      2: bigInt.toString(2),
      8: bigInt.toString(8),
      10: bigInt.toString(10),
      16: bigInt.toString(16).toUpperCase(),
    };
  }, [inputValue, inputBase, t]);

  const copyValue = useCallback((field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500);
  }, []);

  const baseNameMap: Record<Base, string> = {
    2: t("numberBase.binary"),
    8: t("numberBase.octal"),
    10: t("numberBase.decimal"),
    16: t("numberBase.hex"),
  };

  return (
    <ToolLayout
      titleKey="numberBase.title"
      icon="0x"
      descriptionKey="numberBase.description"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("numberBase.input")}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("numberBase.placeholder")}
              className="w-full rounded-sm border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("numberBase.inputBase")}
            </label>
            <div className="flex gap-2">
              {([2, 8, 10, 16] as Base[]).map((base) => (
                <button
                  key={base}
                  onClick={() => {
                    setInputBase(base);
                    setInputValue("");
                    setError("");
                  }}
                  className={`flex-1 rounded-sm border px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    inputBase === base
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-surface-raised text-muted-foreground hover:border-border-focus hover:text-foreground"
                  }`}
                >
                  {baseLabels[base]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-error/40 bg-error-muted/20 p-3">
            <p className="font-mono text-sm text-error/80">{error}</p>
          </div>
        )}

        {conversions && (
          <div className="grid gap-3 sm:grid-cols-2">
            {([2, 8, 10, 16] as Base[]).map((base) => (
              <div
                key={base}
                className={`flex items-center justify-between rounded-md border bg-surface p-4 ${
                  base === inputBase ? "border-accent/30" : "border-border"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {baseNameMap[base]}
                  </span>
                  <p className="mt-1 break-all font-mono text-sm text-foreground">
                    {base === 16 ? conversions[16] : base === 10 ? conversions[10] : base === 8 ? conversions[8] : conversions[2]}
                  </p>
                </div>
                <button
                  onClick={() => copyValue(baseLabels[base], conversions[base])}
                  className="ml-2 shrink-0 rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {copiedField === baseLabels[base] ? "✓" : t("common.copy")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
