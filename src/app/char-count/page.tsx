"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

export default function CharCount() {
  const { t } = useI18n();
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    const text = input;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?。！？]+/g) || []).length || (text.trim() ? 1 : 0) : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).filter((p) => p.trim()).length || 1 : 0;
    const lines = text ? text.split("\n").length : 0;
    const readingTimeMin = Math.max(1, Math.ceil(words / 200));

    const wordFreq: Record<string, number> = {};
    if (text.trim()) {
      const wordList = text.toLowerCase().match(/[a-zA-Z\u4e00-\u9fff]+/g) || [];
      for (const word of wordList) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    }
    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTimeMin, topKeywords };
  }, [input]);

  const statCards = [
    { label: t("charCount.characters"), value: stats.chars },
    { label: t("charCount.charNoSpaces"), value: stats.charsNoSpaces },
    { label: t("charCount.words"), value: stats.words },
    { label: t("charCount.sentences"), value: stats.sentences },
    { label: t("charCount.paragraphs"), value: stats.paragraphs },
    { label: t("charCount.lines"), value: stats.lines },
  ];

  return (
    <ToolLayout
      titleKey="charCount.title"
      icon="Aa"
      descriptionKey="charCount.description"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("charCount.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("charCount.placeholder")}
            className="min-h-[200px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-md border border-border bg-surface p-3 text-center"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {card.label}
              </span>
              <p className="mt-1 font-mono text-xl font-bold text-foreground">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 rounded-md border border-accent/30 bg-accent-glow p-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
            {t("charCount.readingTime")}
          </span>
          <span className="font-mono text-sm font-bold text-foreground">
            {stats.words === 0
              ? t("charCount.lessThan1Min")
              : `${stats.readingTimeMin} ${t("charCount.minutes")}`}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            (200 {t("common.words")}/min)
          </span>
        </div>

        {stats.topKeywords.length > 0 && (
          <div className="rounded-md border border-border bg-surface p-4">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("charCount.keywordDensity")}
            </span>
            <div className="mt-3 space-y-2">
              {stats.topKeywords.map(([word, count]) => (
                <div
                  key={word}
                  className="flex items-center gap-3 rounded-sm bg-surface-raised px-3 py-2"
                >
                  <span className="font-mono text-sm text-accent">&quot;{word}&quot;</span>
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-200"
                        style={{ width: `${Math.min(100, (count / stats.words) * 100 * 3)}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {count} {t("charCount.occurrences")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
