"use client";

import { useState, useMemo } from "react";
import * as Diff from "diff";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

export default function DiffCompare() {
  const { t } = useI18n();
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const changes = useMemo(() => {
    if (!leftText && !rightText) return [];
    return Diff.diffLines(leftText, rightText);
  }, [leftText, rightText]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    for (const change of changes) {
      const lineCount = change.value.split("\n").length - (change.value.endsWith("\n") ? 1 : 0);
      if (change.added) added += lineCount;
      else if (change.removed) removed += lineCount;
      else unchanged += lineCount;
    }
    return { added, removed, unchanged };
  }, [changes]);

  const leftLines = useMemo(() => {
    const lines: { text: string; type: "removed" | "unchanged" }[] = [];
    for (const change of changes) {
      const splitLines = change.value.replace(/\n$/, "").split("\n");
      for (const line of splitLines) {
        if (change.removed) {
          lines.push({ text: line, type: "removed" });
        } else if (!change.added) {
          lines.push({ text: line, type: "unchanged" });
        }
      }
    }
    return lines;
  }, [changes]);

  const rightLines = useMemo(() => {
    const lines: { text: string; type: "added" | "unchanged" }[] = [];
    for (const change of changes) {
      const splitLines = change.value.replace(/\n$/, "").split("\n");
      for (const line of splitLines) {
        if (change.added) {
          lines.push({ text: line, type: "added" });
        } else if (!change.removed) {
          lines.push({ text: line, type: "unchanged" });
        }
      }
    }
    return lines;
  }, [changes]);

  const renderLine = (
    line: { text: string; type: string },
    side: "left" | "right",
    index: number
  ) => {
    const bgClass =
      line.type === "removed"
        ? "bg-error/10"
        : line.type === "added"
        ? "bg-success/10"
        : "";
    const textClass =
      line.type === "removed"
        ? "text-error"
        : line.type === "added"
        ? "text-success"
        : "text-muted-foreground";
    const prefix =
      line.type === "removed" ? "−" : line.type === "added" ? "+" : " ";

    return (
      <div
        key={`${side}-${index}`}
        className={`flex ${bgClass} border-b border-border/30`}
      >
        <span className="inline-block w-8 shrink-0 select-none border-r border-border/30 py-0.5 text-center font-mono text-[10px] text-muted">
          {index + 1}
        </span>
        <span className={`inline-block w-5 shrink-0 select-none py-0.5 text-center font-mono text-xs ${textClass}`}>
          {prefix}
        </span>
        <span className={`whitespace-pre py-0.5 pr-2 font-mono text-xs ${textClass}`}>
          {line.text}
        </span>
      </div>
    );
  };

  return (
    <ToolLayout
      titleKey="diff.title"
      icon="±"
      descriptionKey="diff.description"
    >
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {t("diff.original")}
              </label>
              <button
                onClick={() => setLeftText("")}
                className="rounded-sm border border-border bg-surface-raised px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground"
              >
                {t("common.clear")}
              </button>
            </div>
            <textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder={t("diff.originalPlaceholder")}
              className="min-h-[200px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {t("diff.modified")}
              </label>
              <button
                onClick={() => setRightText("")}
                className="rounded-sm border border-border bg-surface-raised px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground"
              >
                {t("common.clear")}
              </button>
            </div>
            <textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder={t("diff.modifiedPlaceholder")}
              className="min-h-[200px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {(leftText || rightText) && (
          <div className="flex items-center gap-4 rounded-md border border-border bg-surface p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {t("diff.summary")}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-success">
              <span className="inline-block h-2 w-2 rounded-sm bg-success" />
              +{stats.added}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-error">
              <span className="inline-block h-2 w-2 rounded-sm bg-error" />
              −{stats.removed}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-sm bg-muted" />
              {stats.unchanged} {t("diff.unchanged")}
            </span>
          </div>
        )}

        {(leftText || rightText) && (
          <div className="grid gap-0 overflow-hidden rounded-md border border-border lg:grid-cols-2">
            <div className="border-r border-border bg-surface-raised">
              <div className="border-b border-border bg-surface px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("diff.original")}
                </span>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {leftLines.length > 0 ? (
                  leftLines.map((line, i) => renderLine(line, "left", i))
                ) : (
                  <div className="p-4 font-mono text-xs text-muted">{t("common.noContent")}</div>
                )}
              </div>
            </div>
            <div className="bg-surface-raised">
              <div className="border-b border-border bg-surface px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("diff.modified")}
                </span>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {rightLines.length > 0 ? (
                  rightLines.map((line, i) => renderLine(line, "right", i))
                ) : (
                  <div className="p-4 font-mono text-xs text-muted">{t("common.noContent")}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
