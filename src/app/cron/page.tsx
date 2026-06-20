"use client";

import { useState, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

type CronField = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

const fieldLabels: Record<CronField, string> = {
  minute: "Minute",
  hour: "Hour",
  dayOfMonth: "Day (Month)",
  month: "Month",
  dayOfWeek: "Day (Week)",
};

const fieldRanges: Record<CronField, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 6 },
};

const dayOfWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const presets: { label: string; values: Record<CronField, string> }[] = [
  { label: "Every minute", values: { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every hour", values: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Daily at midnight", values: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every Monday", values: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "1" } },
  { label: "Weekdays at 9am", values: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
];

function describeCron(fields: Record<CronField, string>): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;

  if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "Every minute";
  }
  if (minute === "0" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "At minute 0 past every hour";
  }
  if (minute === "0" && hour === "0" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "At midnight every day";
  }
  if (minute === "0" && hour === "0" && dayOfMonth === "*" && month === "*" && dayOfWeek !== "*") {
    const dowName = dayOfWeek.includes("-") ? dayOfWeek : dayOfWeekNames[parseInt(dayOfWeek)] || dayOfWeek;
    return `At midnight on ${dowName}`;
  }
  if (minute === "0" && hour !== "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "1-5") {
    return `At ${hour}:00 on weekdays`;
  }

  const parts: string[] = [];
  parts.push(`At minute ${minute}`);
  parts.push(hour === "*" ? "every hour" : `hour ${hour}`);
  if (dayOfMonth !== "*") parts.push(`on day ${dayOfMonth} of the month`);
  if (month !== "*") parts.push(`in ${monthNames[parseInt(month)] || month}`);
  if (dayOfWeek !== "*") {
    const dowStr = dayOfWeek.includes("-")
      ? dayOfWeek
      : dayOfWeekNames[parseInt(dayOfWeek)] || dayOfWeek;
    parts.push(`on ${dowStr}`);
  }
  return parts.join(", ");
}

function getNextRuns(fields: Record<CronField, string>, count: number): Date[] {
  const now = new Date();
  const results: Date[] = [];
  const candidate = new Date(now.getTime() + 60000);
  candidate.setSeconds(0, 0);

  function matchesField(field: string, value: number): boolean {
    if (field === "*") return true;
    if (field.includes(",")) {
      return field.split(",").some((p) => parseInt(p.trim()) === value);
    }
    if (field.includes("-")) {
      const [start, end] = field.split("-").map(Number);
      return value >= start && value <= end;
    }
    if (field.includes("/")) {
      const [base, step] = field.split("/");
      const baseVal = base === "*" ? 0 : parseInt(base);
      return value >= baseVal && (value - baseVal) % parseInt(step) === 0;
    }
    return parseInt(field) === value;
  }

  const maxIterations = 525600;
  for (let i = 0; i < maxIterations && results.length < count; i++) {
    if (
      matchesField(fields.minute, candidate.getMinutes()) &&
      matchesField(fields.hour, candidate.getHours()) &&
      matchesField(fields.dayOfMonth, candidate.getDate()) &&
      matchesField(fields.month, candidate.getMonth() + 1) &&
      matchesField(fields.dayOfWeek, candidate.getDay())
    ) {
      results.push(new Date(candidate.getTime()));
    }
    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  return results;
}

export default function CronGenerator() {
  const [fields, setFields] = useState<Record<CronField, string>>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });
  const [nextRuns, setNextRuns] = useState<Date[]>([]);

  const cronExpression = `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;
  const description = describeCron(fields);

  const updateField = useCallback((field: CronField, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyPreset = useCallback((preset: typeof presets[number]) => {
    setFields(preset.values);
  }, []);

  useEffect(() => {
    setNextRuns(getNextRuns(fields, 5));
  }, [fields]);

  return (
    <ToolLayout
      title="Cron Generator"
      icon="⌁"
      description="Build and preview cron expressions with human-readable descriptions"
    >
      <div className="space-y-6">
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">
            Generated Expression
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 rounded-sm border border-accent/30 bg-accent/5 px-4 py-3 font-mono text-lg text-accent">
              {cronExpression}
            </code>
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {(Object.keys(fieldLabels) as CronField[]).map((field) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {fieldLabels[field]}
              </label>
              <input
                type="text"
                value={fields[field]}
                onChange={(e) => updateField(field, e.target.value)}
                placeholder={`${fieldRanges[field].min}-${fieldRanges[field].max}`}
                className="w-full rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <span className="font-mono text-[9px] text-muted">
                {fieldRanges[field].min}–{fieldRanges[field].max}
              </span>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className="rounded-sm border border-border bg-surface-raised px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {nextRuns.length > 0 && (
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
              Next 5 Run Times
            </div>
            <div className="rounded-md border border-border bg-surface-raised p-4">
              <ul className="space-y-1.5">
                {nextRuns.map((run, i) => (
                  <li key={i} className="font-mono text-xs text-muted-foreground">
                    <span className="text-accent">{i + 1}.</span>{" "}
                    {run.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
