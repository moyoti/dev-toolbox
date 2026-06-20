"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const formatJson = useCallback(() => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input, indent]);

  const minifyJson = useCallback(() => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input]);

  const copyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }, [output]);

  const syntaxHighlight = (json: string) => {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-accent";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "text-accent" : "text-success";
        } else if (/true|false/.test(match)) {
          cls = "text-info";
        } else if (/null/.test(match)) {
          cls = "text-muted";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      icon="{ }"
      description="Format, minify, and validate JSON with syntax highlighting"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              Input
            </label>
            <div className="flex items-center gap-2">
              <label className="font-mono text-[10px] text-muted">Indent:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-xs text-foreground"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here... e.g. {"key": "value"}'
            className="min-h-[360px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={formatJson}
              className="flex-1 rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
            >
              Format
            </button>
            <button
              onClick={minifyJson}
              className="flex-1 rounded-sm border border-border bg-surface-raised px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
            >
              Minify
            </button>
            <button
              onClick={() => {
                setInput("");
                setOutput("");
                setError("");
              }}
              className="rounded-sm border border-border bg-surface-raised px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-error/40 hover:text-error"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              Output
            </label>
            {output && (
              <button
                onClick={copyOutput}
                className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                Copy
              </button>
            )}
          </div>
          {error ? (
            <div className="min-h-[360px] rounded-md border border-error/40 bg-error-muted/20 p-4">
              <p className="mb-1 font-mono text-xs uppercase tracking-wider text-error">
                Parse Error
              </p>
              <p className="font-mono text-sm text-error/80">{error}</p>
            </div>
          ) : (
            <pre
              className="min-h-[360px] overflow-auto rounded-md border border-border bg-surface-raised p-4 font-mono text-sm leading-relaxed text-foreground"
              dangerouslySetInnerHTML={
                output ? { __html: syntaxHighlight(output) } : undefined
              }
            >
              {output ? null : '<span class="text-muted">Formatted output appears here...</span>'}
            </pre>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
