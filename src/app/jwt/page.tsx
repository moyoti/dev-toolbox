"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface JwtPart {
  header: string;
  payload: string;
  signature: string;
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<JwtPart | null>(null);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const decodeJwt = useCallback(() => {
    setError("");
    setDecoded(null);
    if (!input.trim()) return;

    const parts = input.trim().split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT: must have 3 parts separated by dots");
      return;
    }

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      setDecoded({
        header: JSON.stringify(header, null, 2),
        payload: JSON.stringify(payload, null, 2),
        signature: parts[2],
      });
    } catch {
      setError("Failed to decode JWT: invalid Base64 or malformed token");
    }
  }, [input]);

  const copySection = useCallback((section: string, label: string) => {
    navigator.clipboard.writeText(section);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 1500);
  }, []);

  return (
    <ToolLayout
      title="JWT Decoder"
      icon="◉"
      description="Decode and inspect JSON Web Tokens"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            JWT Token
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JWT token here (e.g. eyJhbGciOi...)"
            className="min-h-[120px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={decodeJwt}
              className="flex-1 rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
            >
              Decode
            </button>
            <button
              onClick={() => {
                setInput("");
                setDecoded(null);
                setError("");
              }}
              className="rounded-sm border border-border bg-surface-raised px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-error/40 hover:text-error"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-error/40 bg-error-muted/20 p-4">
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-error">
              Decode Error
            </p>
            <p className="font-mono text-sm text-error/80">{error}</p>
          </div>
        )}

        {decoded && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-wider text-error">
                  Header
                </label>
                <button
                  onClick={() => copySection(decoded.header, "header")}
                  className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {copiedSection === "header" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre className="min-h-[160px] overflow-auto rounded-md border border-error/30 bg-surface-raised p-4 font-mono text-sm leading-relaxed text-foreground">
                {decoded.header}
              </pre>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-wider text-info">
                  Payload
                </label>
                <button
                  onClick={() => copySection(decoded.payload, "payload")}
                  className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {copiedSection === "payload" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre className="min-h-[160px] overflow-auto rounded-md border border-info/30 bg-surface-raised p-4 font-mono text-sm leading-relaxed text-foreground">
                {decoded.payload}
              </pre>
            </div>

            <div className="flex flex-col gap-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-wider text-muted">
                  Signature
                </label>
                <button
                  onClick={() => copySection(decoded.signature, "signature")}
                  className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {copiedSection === "signature" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-auto rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-muted-foreground">
                {decoded.signature}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
