"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ColorValues {
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  valid: boolean;
}

const defaultColor: ColorValues = {
  hex: "#d97706",
  r: 217,
  g: 119,
  b: 6,
  h: 32,
  s: 95,
  l: 44,
  valid: true,
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (h < 60) { rn = c; gn = x; bn = 0; }
  else if (h < 120) { rn = x; gn = c; bn = 0; }
  else if (h < 180) { rn = 0; gn = c; bn = x; }
  else if (h < 240) { rn = 0; gn = x; bn = c; }
  else if (h < 300) { rn = x; gn = 0; bn = c; }
  else { rn = c; gn = 0; bn = x; }

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, v))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export default function ColorConverter() {
  const [color, setColor] = useState<ColorValues>(defaultColor);
  const [inputValue, setInputValue] = useState("#d97706");
  const [copiedField, setCopiedField] = useState("");

  const parseInput = useCallback((value: string): ColorValues => {
    const trimmed = value.trim();

    if (trimmed.startsWith("#")) {
      const rgb = hexToRgb(trimmed);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), ...rgb, ...hsl, valid: true };
      }
      return { ...defaultColor, valid: false };
    }

    const rgbMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
    if (rgbMatch) {
      const r = Math.min(255, parseInt(rgbMatch[1]));
      const g = Math.min(255, parseInt(rgbMatch[2]));
      const b = Math.min(255, parseInt(rgbMatch[3]));
      const hsl = rgbToHsl(r, g, b);
      return { hex: rgbToHex(r, g, b), r, g, b, ...hsl, valid: true };
    }

    const hslMatch = trimmed.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]) % 360;
      const s = Math.min(100, parseInt(hslMatch[2]));
      const l = Math.min(100, parseInt(hslMatch[3]));
      const rgb = hslToRgb(h, s, l);
      return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), ...rgb, h, s, l, valid: true };
    }

    return { ...defaultColor, valid: false };
  }, []);

  const handleInput = useCallback(
    (value: string) => {
      setInputValue(value);
      const parsed = parseInput(value);
      if (parsed.valid) {
        setColor(parsed);
      }
    },
    [parseInput]
  );

  const copyValue = useCallback((field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500);
  }, []);

  const formats = useMemo(
    () => [
      { label: "HEX", value: color.hex.toUpperCase() },
      { label: "RGB", value: `rgb(${color.r}, ${color.g}, ${color.b})` },
      { label: "HSL", value: `hsl(${color.h}, ${color.s}%, ${color.l}%)` },
    ],
    [color]
  );

  return (
    <ToolLayout
      title="Color Converter"
      icon="◆"
      description="Convert between HEX, RGB, and HSL color formats in real-time"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            Color Input
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="#d97706, rgb(217, 119, 6), hsl(32, 95%, 44%)"
              className="flex-1 rounded-sm border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <input
              type="color"
              value={color.valid ? color.hex : "#d97706"}
              onChange={(e) => {
                const hex = e.target.value;
                setInputValue(hex);
                const parsed = parseInput(hex);
                if (parsed.valid) setColor(parsed);
              }}
              className="h-10 w-14 cursor-pointer rounded-sm border border-border bg-surface-raised"
            />
          </div>
          {!color.valid && inputValue && (
            <p className="font-mono text-xs text-error">Invalid color format</p>
          )}
        </div>

        <div
          className="h-32 rounded-md border border-border transition-colors duration-200"
          style={{ backgroundColor: color.valid ? color.hex : "#1e1e1e" }}
        >
          <div className="flex h-full items-end p-4">
            <span className="rounded-sm bg-black/60 px-2 py-1 font-mono text-xs text-white">
              {color.valid ? color.hex.toUpperCase() : "Invalid"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {formats.map((fmt) => (
            <div
              key={fmt.label}
              className="flex items-center justify-between rounded-md border border-border bg-surface p-4"
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {fmt.label}
                </span>
                <p className="mt-1 font-mono text-sm text-foreground">{fmt.value}</p>
              </div>
              <button
                onClick={() => copyValue(fmt.label, fmt.value)}
                className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {copiedField === fmt.label ? "✓" : "Copy"}
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "R", value: color.r, max: 255 },
            { label: "G", value: color.g, max: 255 },
            { label: "B", value: color.b, max: 255 },
          ].map((ch) => (
            <div key={ch.label} className="rounded-md border border-border bg-surface p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {ch.label}
                </span>
                <span className="font-mono text-sm text-foreground">{ch.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-raised">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-200"
                  style={{ width: `${(ch.value / ch.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
