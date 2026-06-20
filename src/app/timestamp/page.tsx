"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState("");
  const [dateOutput, setDateOutput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tsOutput, setTsOutput] = useState("");
  const [useMilliseconds, setUseMilliseconds] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTimestamp = useCallback(
    (value: string) => {
      setTimestampInput(value);
      if (!value.trim()) {
        setDateOutput("");
        return;
      }
      const num = Number(value);
      if (isNaN(num)) {
        setDateOutput("Invalid timestamp");
        return;
      }
      const ms = useMilliseconds ? num : num * 1000;
      const date = new Date(ms);
      if (isNaN(date.getTime())) {
        setDateOutput("Invalid timestamp");
        return;
      }
      setDateOutput(
        date.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    },
    [useMilliseconds]
  );

  const convertDate = useCallback((value: string) => {
    setDateInput(value);
    if (!value.trim()) {
      setTsOutput("");
      return;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      setTsOutput("Invalid date");
      return;
    }
    setTsOutput(Math.floor(date.getTime() / 1000).toString());
  }, []);

  const copyValue = useCallback((field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500);
  }, []);

  const setCurrentTimestamp = useCallback(() => {
    const ts = useMilliseconds ? Date.now().toString() : Math.floor(Date.now() / 1000).toString();
    setTimestampInput(ts);
    convertTimestamp(ts);
  }, [useMilliseconds, convertTimestamp]);

  const setCurrentDate = useCallback(() => {
    const dateStr = new Date().toISOString().slice(0, 16);
    setDateInput(dateStr);
    convertDate(dateStr);
  }, [convertDate]);

  return (
    <ToolLayout
      title="Timestamp"
      icon="⏱"
      description="Convert between Unix timestamps and human-readable dates"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-md border border-accent/30 bg-accent-glow p-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
              Current Unix Timestamp
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">{now}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-muted-foreground">
              {new Date().toISOString()}
            </p>
            <p className="mt-1 font-mono text-xs text-muted">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            Unit:
          </label>
          <button
            onClick={() => setUseMilliseconds(false)}
            className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
              !useMilliseconds
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface-raised text-muted-foreground hover:text-foreground"
            }`}
          >
            Seconds
          </button>
          <button
            onClick={() => setUseMilliseconds(true)}
            className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
              useMilliseconds
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface-raised text-muted-foreground hover:text-foreground"
            }`}
          >
            Milliseconds
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Timestamp → Date
              </span>
              <button
                onClick={setCurrentTimestamp}
                className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                Now
              </button>
            </div>
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => convertTimestamp(e.target.value)}
              placeholder={`Enter ${useMilliseconds ? "millisecond" : "second"} timestamp...`}
              className="w-full rounded-sm border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {dateOutput && (
              <div className="flex items-start justify-between gap-2 rounded-sm bg-surface-raised p-3">
                <p
                  className={`font-mono text-sm ${
                    dateOutput === "Invalid timestamp" ? "text-error" : "text-foreground"
                  }`}
                >
                  {dateOutput}
                </p>
                {dateOutput !== "Invalid timestamp" && (
                  <button
                    onClick={() => copyValue("ts2date", dateOutput)}
                    className="shrink-0 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-accent"
                  >
                    {copiedField === "ts2date" ? "✓" : "Copy"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Date → Timestamp
              </span>
              <button
                onClick={setCurrentDate}
                className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                Now
              </button>
            </div>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => convertDate(e.target.value)}
              className="w-full rounded-sm border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-foreground focus:border-accent focus:outline-none"
            />
            {tsOutput && (
              <div className="flex items-start justify-between gap-2 rounded-sm bg-surface-raised p-3">
                <p
                  className={`font-mono text-sm ${
                    tsOutput === "Invalid date" ? "text-error" : "text-foreground"
                  }`}
                >
                  {tsOutput}
                </p>
                {tsOutput !== "Invalid date" && (
                  <button
                    onClick={() => copyValue("date2ts", tsOutput)}
                    className="shrink-0 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-accent"
                  >
                    {copiedField === "date2ts" ? "✓" : "Copy"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            Quick Reference
          </span>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              { label: "1 hour ago", value: Math.floor(Date.now() / 1000) - 3600 },
              { label: "24 hours ago", value: Math.floor(Date.now() / 1000) - 86400 },
              { label: "1 week ago", value: Math.floor(Date.now() / 1000) - 604800 },
            ].map((ref) => (
              <button
                key={ref.label}
                onClick={() => {
                  setTimestampInput(ref.value.toString());
                  convertTimestamp(ref.value.toString());
                }}
                className="flex flex-col items-start rounded-sm border border-border bg-surface-raised p-3 text-left transition-colors hover:border-accent/40"
              >
                <span className="font-mono text-[10px] uppercase text-muted">{ref.label}</span>
                <span className="font-mono text-sm text-foreground">{ref.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
