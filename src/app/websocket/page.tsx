"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface LogEntry {
  id: number;
  type: "sent" | "received" | "system";
  message: string;
  timestamp: Date;
}

export default function WebSocketClient() {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoReconnect, setAutoReconnect] = useState(false);
  const [logId, setLogId] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((type: LogEntry["type"], msg: string) => {
    setLogId((prev) => {
      const newId = prev + 1;
      setLogs((old) => [...old, { id: newId, type, message: msg, timestamp: new Date() }]);
      return newId;
    });
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    cleanup();

    if (!url.trim()) return;

    const wsUrl = url.trim();
    setStatus("connecting");
    addLog("system", `${t("websocket.connecting")} ${wsUrl}`);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        addLog("system", t("websocket.connected"));
      };

      ws.onclose = () => {
        setStatus("disconnected");
        addLog("system", t("websocket.disconnected"));

        if (autoReconnect && wsRef.current === ws) {
          reconnectTimeoutRef.current = setTimeout(() => {
            addLog("system", t("websocket.connecting") + " (auto-reconnect)");
            connect();
          }, 2000);
        }
      };

      ws.onerror = () => {
        addLog("system", t("common.error") + ": Connection failed");
      };

      ws.onmessage = (event) => {
        const data = typeof event.data === "string" ? event.data : String(event.data);
        addLog("received", data);
      };
    } catch (err) {
      setStatus("disconnected");
      addLog("system", err instanceof Error ? err.message : t("common.error"));
    }
  }, [url, autoReconnect, cleanup, addLog, t]);

  const disconnect = useCallback(() => {
    cleanup();
    setStatus("disconnected");
    addLog("system", t("websocket.disconnected"));
  }, [cleanup, addLog, t]);

  const sendMessage = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog("system", t("common.error") + ": Not connected");
      return;
    }
    if (!message.trim()) return;

    wsRef.current.send(message);
    addLog("sent", message);
    setMessage("");
  }, [message, addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const statusDotColor = () => {
    switch (status) {
      case "connected": return "bg-success";
      case "connecting": return "bg-warning";
      case "disconnected": return "bg-error";
    }
  };

  const statusText = () => {
    switch (status) {
      case "connected": return t("websocket.connected");
      case "connecting": return t("websocket.connecting");
      case "disconnected": return t("websocket.disconnected");
    }
  };

  const logTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "sent": return "text-accent";
      case "received": return "text-success";
      case "system": return "text-muted";
    }
  };

  const logTypeLabel = (type: LogEntry["type"]) => {
    switch (type) {
      case "sent": return t("websocket.sent");
      case "received": return t("websocket.received");
      case "system": return t("websocket.system");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <ToolLayout
      titleKey="websocket.title"
      icon="WS"
      descriptionKey="websocket.description"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("websocket.urlPlaceholder")}
            className="flex-1 rounded-md border border-border bg-surface-raised px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            disabled={status === "connected" || status === "connecting"}
          />
          {status === "disconnected" ? (
            <button
              onClick={connect}
              disabled={!url.trim()}
              className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
            >
              {t("websocket.connect")}
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="rounded-sm border border-error bg-error/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-error transition-colors hover:bg-error/20"
            >
              {t("websocket.disconnect")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${statusDotColor()}`} />
            <span className="font-mono text-xs text-muted-foreground">{statusText()}</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoReconnect}
              onChange={(e) => setAutoReconnect(e.target.checked)}
              className="rounded-sm border-border bg-surface-raised accent-accent"
            />
            <span className="font-mono text-xs text-muted-foreground">{t("websocket.autoReconnect")}</span>
          </label>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("websocket.messagePlaceholder")}
            className="flex-1 rounded-md border border-border bg-surface-raised px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            disabled={status !== "connected"}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          />
          <button
            onClick={sendMessage}
            disabled={status !== "connected" || !message.trim()}
            className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
          >
            {t("websocket.send")}
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("websocket.message")}
            </label>
            <button
              onClick={clearLogs}
              className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
            >
              {t("websocket.clearLog")}
            </button>
          </div>
          <div
            ref={logContainerRef}
            className="min-h-[300px] max-h-[500px] overflow-y-auto rounded-md border border-border bg-surface-raised p-4"
          >
            {logs.length === 0 ? (
              <p className="font-mono text-sm text-muted">{t("websocket.noMessages")}</p>
            ) : (
              <div className="space-y-1.5">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="font-mono text-[10px] text-muted shrink-0">{formatTime(log.timestamp)}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-wider shrink-0 ${logTypeColor(log.type)}`}>
                      [{logTypeLabel(log.type)}]
                    </span>
                    <span className={`font-mono text-sm break-all ${logTypeColor(log.type)}`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
