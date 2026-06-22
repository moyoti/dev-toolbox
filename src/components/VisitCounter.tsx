"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface VisitCounterProps {
  type: "global" | "tool";
  tool?: string;
}

export default function VisitCounter({ type, tool }: VisitCounterProps) {
  const { t } = useI18n();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const endpoint =
      type === "global"
        ? "/api/visit"
        : `/api/tool-usage/${tool}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null));
  }, [type, tool]);

  if (count === null) return null;

  const label =
    type === "global"
      ? t("visitCounter.globalLabel")
      : t("visitCounter.toolLabel");

  return (
    <div className="flex items-center gap-2 rounded-sm border border-border bg-surface-raised px-3 py-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">👁</span>
      <span className="font-mono text-xs text-muted-foreground">
        {label} <span className="text-accent font-bold">#{count.toLocaleString()}</span>
      </span>
    </div>
  );
}
