"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
type ContentType = "application/json" | "application/x-www-form-urlencoded" | "text/plain";

interface HeaderRow {
  id: number;
  key: string;
  value: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  time: number;
  headers: Record<string, string>;
  body: string;
}

export default function HttpClient() {
  const { t } = useI18n();
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { id: 1, key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState("");
  const [contentType, setContentType] = useState<ContentType>("application/json");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState("");
  const [nextHeaderId, setNextHeaderId] = useState(2);

  const addHeader = useCallback(() => {
    setHeaders((prev) => [...prev, { id: nextHeaderId, key: "", value: "" }]);
    setNextHeaderId((prev) => prev + 1);
  }, [nextHeaderId]);

  const removeHeader = useCallback((id: number) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const updateHeader = useCallback((id: number, field: "key" | "value", val: string) => {
    setHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)));
  }, []);

  const sendRequest = useCallback(async () => {
    setError("");
    setResponse(null);

    if (!url.trim()) {
      setError(t("httpClient.invalidUrl"));
      return;
    }

    try {
      new URL(url.trim());
    } catch {
      setError(t("httpClient.invalidUrl"));
      return;
    }

    setLoading(true);
    const startTime = performance.now();

    try {
      const headerObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim()) {
          headerObj[h.key.trim()] = h.value;
        }
      });

      const fetchOptions: RequestInit = {
        method,
        headers: headerObj,
      };

      if (method !== "GET" && method !== "HEAD") {
        fetchOptions.body = body;
      }

      const res = await fetch(url.trim(), fetchOptions);
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      let resBody = "";
      try {
        resBody = await res.text();
        try {
          const parsed = JSON.parse(resBody);
          resBody = JSON.stringify(parsed, null, 2);
        } catch {
          resBody = resBody;
        }
      } catch {
        resBody = "[Unable to read response body]";
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: elapsed,
        headers: resHeaders,
        body: resBody,
      });
    } catch (err) {
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError(t("httpClient.corsWarning"));
      } else {
        setError(err instanceof Error ? err.message : t("httpClient.networkError"));
      }
      void elapsed;
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body, t]);

  const copyResponse = useCallback(() => {
    if (response) {
      navigator.clipboard.writeText(response.body);
    }
  }, [response]);

  const statusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-success";
    if (status >= 300 && status < 400) return "text-info";
    if (status >= 400 && status < 500) return "text-warning";
    return "text-error";
  };

  const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

  return (
    <ToolLayout
      titleKey="httpClient.title"
      icon="API"
      descriptionKey="httpClient.description"
    >
      <div className="rounded-sm border border-warning/30 bg-warning-muted/20 p-3">
        <p className="font-mono text-xs text-warning">{t("httpClient.corsWarning")}</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs uppercase tracking-wider text-accent focus:border-accent focus:outline-none"
          >
            {methods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("httpClient.urlPlaceholder")}
            className="flex-1 rounded-md border border-border bg-surface-raised px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            onKeyDown={(e) => { if (e.key === "Enter") sendRequest(); }}
          />
          <button
            onClick={sendRequest}
            disabled={loading}
            className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
          >
            {loading ? t("httpClient.sending") : t("httpClient.send")}
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("httpClient.headers")}
            </label>
            <button
              onClick={addHeader}
              className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
            >
              {t("httpClient.addHeader")}
            </button>
          </div>
          <div className="space-y-1">
            {headers.map((h) => (
              <div key={h.id} className="flex gap-2">
                <input
                  type="text"
                  value={h.key}
                  onChange={(e) => updateHeader(h.id, "key", e.target.value)}
                  placeholder={t("httpClient.headerKey")}
                  className="flex-1 rounded-sm border border-border bg-surface-raised px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <input
                  type="text"
                  value={h.value}
                  onChange={(e) => updateHeader(h.id, "value", e.target.value)}
                  placeholder={t("httpClient.headerValue")}
                  className="flex-1 rounded-sm border border-border bg-surface-raised px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <button
                  onClick={() => removeHeader(h.id)}
                  className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-error/40 hover:text-error"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {method !== "GET" && method !== "HEAD" && (
          <div>
            <div className="mb-2 flex items-center gap-3">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {t("httpClient.body")}
              </label>
              <select
                value={contentType}
                onChange={(e) => {
                  setContentType(e.target.value as ContentType);
                  setHeaders((prev) =>
                    prev.map((h) =>
                      h.key.toLowerCase() === "content-type"
                        ? { ...h, value: e.target.value }
                        : h
                    )
                  );
                }}
                className="rounded-sm border border-border bg-surface-raised px-2 py-1 font-mono text-[10px] text-muted-foreground focus:border-accent focus:outline-none"
              >
                <option value="application/json">JSON</option>
                <option value="application/x-www-form-urlencoded">Form Data</option>
                <option value="text/plain">Plain Text</option>
              </select>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("httpClient.bodyPlaceholder")}
              className="min-h-[120px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-sm border border-error/40 bg-error-muted/20 p-4">
          <p className="font-mono text-sm text-error">{error}</p>
        </div>
      )}

      {response && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("httpClient.response")}
            </label>
            <button
              onClick={copyResponse}
              className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
            >
              {t("httpClient.copyResponse")}
            </button>
          </div>

          <div className="flex gap-4 rounded-sm border border-border bg-surface-raised p-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {t("httpClient.statusCode")}
              </span>
              <p className={`font-mono text-lg font-bold ${statusColor(response.status)}`}>
                {response.status} {response.statusText}
              </p>
            </div>
            <div className="border-l border-border pl-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {t("httpClient.responseTime")}
              </span>
              <p className="font-mono text-lg font-bold text-foreground">
                {response.time}<span className="text-xs text-muted">ms</span>
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
              {t("httpClient.responseHeaders")}
            </label>
            <div className="rounded-sm border border-border bg-surface-raised p-3">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex gap-2 border-b border-border/50 last:border-0">
                  <span className="font-mono text-xs text-accent">{key}:</span>
                  <span className="font-mono text-xs text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
              {t("httpClient.responseBody")}
            </label>
            <pre className="max-h-[400px] overflow-auto rounded-md border border-border bg-surface-raised p-4 font-mono text-sm leading-relaxed text-foreground">
              {response.body}
            </pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
