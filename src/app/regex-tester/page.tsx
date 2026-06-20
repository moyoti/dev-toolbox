"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

export default function RegexTester() {
  const { t } = useI18n();
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });

  const flagString = useMemo(
    () =>
      Object.entries(flags)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(""),
    [flags]
  );

  const result = useMemo(() => {
    if (!pattern) return { matches: [], groups: [], highlighted: testString, error: "" };
    try {
      const regex = new RegExp(pattern, flagString);
      const matches: { full: string; index: number; groups: Record<string, string> }[] = [];

      if (flagString.includes("g")) {
        let match: RegExpExecArray | null;
        const re = new RegExp(pattern, flagString);
        while ((match = re.exec(testString)) !== null) {
          matches.push({
            full: match[0],
            index: match.index,
            groups: match.groups ?? {},
          });
          if (!match[0]) re.lastIndex++;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            full: match[0],
            index: match.index,
            groups: match.groups ?? {},
          });
        }
      }

      let highlighted = testString;
      if (matches.length > 0) {
        const parts: { text: string; isMatch: boolean }[] = [];
        let lastIndex = 0;
        for (const m of matches) {
          if (m.index > lastIndex) {
            parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false });
          }
          parts.push({ text: m.full, isMatch: true });
          lastIndex = m.index + m.full.length;
        }
        if (lastIndex < testString.length) {
          parts.push({ text: testString.slice(lastIndex), isMatch: false });
        }
        highlighted = parts
          .map((p) =>
            p.isMatch
              ? `<mark class="bg-accent/30 text-accent rounded-sm px-0.5">${p.text}</mark>`
              : p.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
          )
          .join("");
      } else {
        highlighted = testString.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      return { matches, groups: matches.flatMap((m, i) => Object.entries(m.groups).map(([k, v]) => ({ matchIndex: i, key: k, value: v }))), highlighted, error: "" };
    } catch (e) {
      return {
        matches: [],
        groups: [],
        highlighted: testString.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        error: e instanceof Error ? e.message : t("regexTester.invalidRegex"),
      };
    }
  }, [pattern, testString, flagString, t]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <ToolLayout
      titleKey="regexTester.title"
      icon=".*"
      descriptionKey="regexTester.description"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg text-muted">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t("regexTester.pattern")}
              className="flex-1 border-none bg-transparent font-mono text-sm text-foreground placeholder:text-muted focus:outline-none"
            />
            <span className="font-mono text-lg text-muted">/</span>
            <span className="font-mono text-sm text-accent">{flagString}</span>
          </div>
          <div className="flex gap-2">
            {(["g", "i", "m", "s"] as const).map((flag) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
                  flags[flag]
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface-raised text-muted-foreground hover:border-border-focus hover:text-foreground"
                }`}
              >
                {flag}
              </button>
            ))}
          </div>
          {result.error && (
            <p className="font-mono text-xs text-error">{result.error}</p>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("regexTester.testString")}
            </label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder={t("regexTester.pattern")}
              className="min-h-[240px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("regexTester.matchResult")}
            </label>
            <div
              className="min-h-[240px] overflow-auto rounded-md border border-border bg-surface-raised p-4 font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: result.highlighted || `<span class="text-muted">${t("regexTester.matchPlaceholder")}</span>` }}
            />
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("regexTester.matches")}
            </span>
            <span className="rounded-sm bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
              {result.matches.length}
            </span>
          </div>
          {result.matches.length > 0 ? (
            <div className="space-y-1">
              {result.matches.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-sm bg-surface-raised px-3 py-2"
                >
                  <span className="font-mono text-[10px] text-muted">#{i + 1}</span>
                  <span className="font-mono text-sm text-accent">&quot;{m.full}&quot;</span>
                  <span className="font-mono text-[10px] text-muted">{t("regexTester.index")}: {m.index}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-mono text-xs text-muted">{t("regexTester.noMatches")}</p>
          )}
        </div>

        {result.groups.length > 0 && (
          <div className="rounded-md border border-border bg-surface p-4">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("regexTester.captureGroups")}
            </span>
            <div className="mt-3 space-y-1">
              {result.groups.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-sm bg-surface-raised px-3 py-2"
                >
                  <span className="font-mono text-[10px] text-muted">
                    Match #{g.matchIndex + 1}
                  </span>
                  <span className="font-mono text-sm text-info">${g.key}</span>
                  <span className="text-muted">=</span>
                  <span className="font-mono text-sm text-foreground">
                    &quot;{g.value}&quot;
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
