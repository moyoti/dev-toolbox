"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

interface ColorStop {
  color: string;
  position: number;
  id: number;
}

type Direction = "to right" | "to bottom" | "to bottom right" | "45deg" | "135deg" | "circle";

const presetGradients: { nameKey: string; stops: ColorStop[]; direction: Direction }[] = [
  { nameKey: "gradient.presetSunset", stops: [{ color: "#f97316", position: 0, id: 0 }, { color: "#ec4899", position: 50, id: 1 }, { color: "#8b5cf6", position: 100, id: 2 }], direction: "to right" },
  { nameKey: "gradient.presetOcean", stops: [{ color: "#0ea5e9", position: 0, id: 0 }, { color: "#06b6d4", position: 50, id: 1 }, { color: "#14b8a6", position: 100, id: 2 }], direction: "to bottom right" },
  { nameKey: "gradient.presetForest", stops: [{ color: "#166534", position: 0, id: 0 }, { color: "#22c55e", position: 50, id: 1 }, { color: "#86efac", position: 100, id: 2 }], direction: "to bottom" },
  { nameKey: "gradient.presetNeon", stops: [{ color: "#f0abfc", position: 0, id: 0 }, { color: "#c084fc", position: 33, id: 1 }, { color: "#7c3aed", position: 66, id: 2 }, { color: "#4f46e5", position: 100, id: 3 }], direction: "135deg" },
  { nameKey: "gradient.presetFire", stops: [{ color: "#fbbf24", position: 0, id: 0 }, { color: "#f97316", position: 40, id: 1 }, { color: "#ef4444", position: 100, id: 2 }], direction: "to right" },
  { nameKey: "gradient.presetAurora", stops: [{ color: "#1e3a5f", position: 0, id: 0 }, { color: "#22c55e", position: 40, id: 1 }, { color: "#06b6d4", position: 70, id: 2 }, { color: "#7c3aed", position: 100, id: 3 }], direction: "to bottom" },
];

let nextId = 100;

export default function GradientGenerator() {
  const { t } = useI18n();
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#d97706", position: 0, id: 1 },
    { color: "#92400e", position: 100, id: 2 },
  ]);
  const [direction, setDirection] = useState<Direction>("to right");
  const [copied, setCopied] = useState(false);

  const directionOptions: { value: Direction; labelKey: string }[] = [
    { value: "to right", labelKey: "gradient.toRight" },
    { value: "to bottom", labelKey: "gradient.toBottom" },
    { value: "to bottom right", labelKey: "gradient.toBottomRight" },
    { value: "45deg", labelKey: "gradient.deg45" },
    { value: "135deg", labelKey: "gradient.deg135" },
    { value: "circle", labelKey: "gradient.circle" },
  ];

  const gradientCSS = useMemo(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const colorStops = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (direction === "circle") {
      return `radial-gradient(circle, ${colorStops})`;
    }
    return `linear-gradient(${direction}, ${colorStops})`;
  }, [stops, direction]);

  const addStop = useCallback(() => {
    const newStop: ColorStop = {
      color: "#6b7280",
      position: 50,
      id: nextId++,
    };
    setStops((prev) => [...prev, newStop]);
  }, []);

  const removeStop = useCallback((id: number) => {
    setStops((prev) => prev.length > 2 ? prev.filter((s) => s.id !== id) : prev);
  }, []);

  const updateStop = useCallback((id: number, field: keyof ColorStop, value: string | number) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }, []);

  const copyCSS = useCallback(() => {
    navigator.clipboard.writeText(gradientCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [gradientCSS]);

  const applyPreset = useCallback((preset: typeof presetGradients[number]) => {
    setStops(preset.stops.map((s) => ({ ...s, id: nextId++ })));
    setDirection(preset.direction);
  }, []);

  return (
    <ToolLayout
      titleKey="gradient.title"
      icon="▓"
      descriptionKey="gradient.description"
    >
      <div className="space-y-4">
        <div
          className="h-40 rounded-md border border-border transition-all duration-200"
          style={{ background: gradientCSS }}
        />

        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("gradient.direction")}
          </label>
          <div className="flex flex-wrap gap-2">
            {directionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDirection(opt.value)}
                className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
                  direction === opt.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface-raised text-muted-foreground hover:border-border-focus hover:text-foreground"
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("gradient.colorStops")}
            </label>
            <button
              onClick={addStop}
              className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
            >
              {t("gradient.addStop")}
            </button>
          </div>
          <div className="space-y-2">
            {stops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3 rounded-sm border border-border bg-surface p-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-sm border border-border bg-surface-raised"
                />
                <div className="flex flex-1 items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {t("gradient.position")}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                    className="flex-1 accent-accent"
                  />
                  <span className="w-8 text-right font-mono text-xs text-foreground">{stop.position}%</span>
                </div>
                {stops.length > 2 && (
                  <button
                    onClick={() => removeStop(stop.id)}
                    className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-error/40 hover:text-error"
                  >
                    {t("gradient.removeStop")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("gradient.cssCode")}
            </label>
            <button
              onClick={copyCSS}
              className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
            >
              {copied ? t("common.copied") : t("common.copy")}
            </button>
          </div>
          <div className="rounded-md border border-border bg-surface-raised p-4">
            <code className="break-all font-mono text-sm text-accent">{gradientCSS}</code>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("gradient.presets")}
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {presetGradients.map((preset) => {
              const sorted = [...preset.stops].sort((a, b) => a.position - b.position);
              const colorStops = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
              const css = preset.direction === "circle"
                ? `radial-gradient(circle, ${colorStops})`
                : `linear-gradient(${preset.direction}, ${colorStops})`;
              return (
                <button
                  key={preset.nameKey}
                  onClick={() => applyPreset(preset)}
                  className="group flex flex-col items-start rounded-sm border border-border bg-surface p-2 text-left transition-colors hover:border-accent/40"
                >
                  <div
                    className="mb-2 h-10 w-full rounded-sm"
                    style={{ background: css }}
                  />
                  <span className="font-mono text-[10px] uppercase text-muted group-hover:text-accent">
                    {t(preset.nameKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
