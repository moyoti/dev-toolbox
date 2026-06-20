"use client";

import { useState, useCallback, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

interface StatusEntry {
  code: number;
  name: string;
  description: string;
  group: string;
}

const statusCodes: StatusEntry[] = [
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body", group: "1xx Informational" },
  { code: 101, name: "Switching Protocols", description: "The server is switching protocols as requested by the client via Upgrade header", group: "1xx Informational" },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet", group: "1xx Informational" },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message", group: "1xx Informational" },

  { code: 200, name: "OK", description: "The request has succeeded", group: "2xx Success" },
  { code: 201, name: "Created", description: "The request has been fulfilled and a new resource has been created", group: "2xx Success" },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed", group: "2xx Success" },
  { code: 203, name: "Non-Authoritative Information", description: "The returned meta-information is from a local or third-party copy, not the origin server", group: "2xx Success" },
  { code: 204, name: "No Content", description: "The server has fulfilled the request but does not need to return an entity-body", group: "2xx Success" },
  { code: 205, name: "Reset Content", description: "The server has fulfilled the request and the user agent should reset the document view", group: "2xx Success" },
  { code: 206, name: "Partial Content", description: "The server has fulfilled the partial GET request for the resource", group: "2xx Success" },
  { code: 207, name: "Multi-Status", description: "Conveys information about multiple resources in situations where multiple status codes might be appropriate", group: "2xx Success" },
  { code: 208, name: "Already Reported", description: "Members of a DAV binding have already been enumerated in a previous reply", group: "2xx Success" },
  { code: 226, name: "IM Used", description: "The server has fulfilled a GET request for the resource with instance manipulations applied", group: "2xx Success" },

  { code: 300, name: "Multiple Choices", description: "The target resource has more than one representation, each with its own URI", group: "3xx Redirection" },
  { code: 301, name: "Moved Permanently", description: "The target resource has been assigned a new permanent URI", group: "3xx Redirection" },
  { code: 302, name: "Found", description: "The target resource resides temporarily under a different URI", group: "3xx Redirection" },
  { code: 303, name: "See Other", description: "The server is redirecting the user agent to a different resource via GET", group: "3xx Redirection" },
  { code: 304, name: "Not Modified", description: "The resource has not been modified since the last request", group: "3xx Redirection" },
  { code: 305, name: "Use Proxy", description: "The requested resource must be accessed through the proxy given by the Location field", group: "3xx Redirection" },
  { code: 307, name: "Temporary Redirect", description: "The target resource resides temporarily under a different URI and the method must not change", group: "3xx Redirection" },
  { code: 308, name: "Permanent Redirect", description: "The target resource has been assigned a new permanent URI and the method must not change", group: "3xx Redirection" },

  { code: 400, name: "Bad Request", description: "The server could not understand the request due to malformed syntax", group: "4xx Client Error" },
  { code: 401, name: "Unauthorized", description: "The request requires user authentication", group: "4xx Client Error" },
  { code: 402, name: "Payment Required", description: "Reserved for future use — intended for digital payment systems", group: "4xx Client Error" },
  { code: 403, name: "Forbidden", description: "The server understood the request but refuses to authorize it", group: "4xx Client Error" },
  { code: 404, name: "Not Found", description: "The server has not found anything matching the Request-URI", group: "4xx Client Error" },
  { code: 405, name: "Method Not Allowed", description: "The method specified in the request is not allowed for the resource", group: "4xx Client Error" },
  { code: 406, name: "Not Acceptable", description: "The resource is not capable of generating content acceptable according to the Accept headers", group: "4xx Client Error" },
  { code: 407, name: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy", group: "4xx Client Error" },
  { code: 408, name: "Request Timeout", description: "The server did not receive a complete request message within the time it was prepared to wait", group: "4xx Client Error" },
  { code: 409, name: "Conflict", description: "The request could not be completed due to a conflict with the current state of the resource", group: "4xx Client Error" },
  { code: 410, name: "Gone", description: "The resource is no longer available and no forwarding address is known", group: "4xx Client Error" },
  { code: 411, name: "Length Required", description: "The server refuses to accept the request without a defined Content-Length", group: "4xx Client Error" },
  { code: 412, name: "Precondition Failed", description: "One or more conditions given in the request header fields evaluated to false", group: "4xx Client Error" },
  { code: 413, name: "Payload Too Large", description: "The request payload is larger than the server is willing or able to process", group: "4xx Client Error" },
  { code: 414, name: "URI Too Long", description: "The request-target is longer than the server is willing to interpret", group: "4xx Client Error" },
  { code: 415, name: "Unsupported Media Type", description: "The origin server refuses the request because the payload is in an unsupported format", group: "4xx Client Error" },
  { code: 416, name: "Range Not Satisfiable", description: "None of the ranges in the Range header field overlap the current extent of the resource", group: "4xx Client Error" },
  { code: 417, name: "Expectation Failed", description: "The expectation given in the Expect header field could not be met by the server", group: "4xx Client Error" },
  { code: 418, name: "I'm a Teapot", description: "The server refuses to brew coffee because it is, permanently, a teapot", group: "4xx Client Error" },
  { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response", group: "4xx Client Error" },
  { code: 422, name: "Unprocessable Entity", description: "The server understands the content type but was unable to process the contained instructions", group: "4xx Client Error" },
  { code: 423, name: "Locked", description: "The source or destination resource of a method is locked", group: "4xx Client Error" },
  { code: 424, name: "Failed Dependency", description: "The method could not be performed because the requested action depended on another action that failed", group: "4xx Client Error" },
  { code: 425, name: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed", group: "4xx Client Error" },
  { code: 426, name: "Upgrade Required", description: "The server refuses to perform the request using the current protocol", group: "4xx Client Error" },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional", group: "4xx Client Error" },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time", group: "4xx Client Error" },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large", group: "4xx Client Error" },
  { code: 451, name: "Unavailable For Legal Reasons", description: "The server is denying access to the resource as a consequence of a legal demand", group: "4xx Client Error" },

  { code: 500, name: "Internal Server Error", description: "The server encountered an unexpected condition that prevented it from fulfilling the request", group: "5xx Server Error" },
  { code: 501, name: "Not Implemented", description: "The server does not support the functionality required to fulfill the request", group: "5xx Server Error" },
  { code: 502, name: "Bad Gateway", description: "The server, while acting as a gateway, received an invalid response from an upstream server", group: "5xx Server Error" },
  { code: 503, name: "Service Unavailable", description: "The server is currently unable to handle the request due to temporary overloading or maintenance", group: "5xx Server Error" },
  { code: 504, name: "Gateway Timeout", description: "The server, while acting as a gateway, did not receive a timely response from an upstream server", group: "5xx Server Error" },
  { code: 505, name: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request", group: "5xx Server Error" },
  { code: 506, name: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference", group: "5xx Server Error" },
  { code: 507, name: "Insufficient Storage", description: "The method could not be performed on the resource because the server is unable to store the representation", group: "5xx Server Error" },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request", group: "5xx Server Error" },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it", group: "5xx Server Error" },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access", group: "5xx Server Error" },
];

const groupOrder = ["1xx Informational", "2xx Success", "3xx Redirection", "4xx Client Error", "5xx Server Error"];

const groupColors: Record<string, string> = {
  "1xx Informational": "text-info border-info/30",
  "2xx Success": "text-success border-success/30",
  "3xx Redirection": "text-warning border-warning/30",
  "4xx Client Error": "text-error border-error/30",
  "5xx Server Error": "text-accent border-accent/30",
};

export default function HttpStatus() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return statusCodes;
    const q = search.toLowerCase();
    return statusCodes.filter(
      (s) =>
        s.code.toString().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<string, StatusEntry[]>();
    for (const entry of filtered) {
      const existing = map.get(entry.group) || [];
      existing.push(entry);
      map.set(entry.group, existing);
    }
    return groupOrder
      .filter((g) => map.has(g))
      .map((g) => ({ group: g, entries: map.get(g)! }));
  }, [filtered]);

  const copyCode = useCallback((code: number) => {
    navigator.clipboard.writeText(code.toString());
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }, []);

  return (
    <ToolLayout
      titleKey="httpStatus.title"
      icon="HTTP"
      descriptionKey="httpStatus.description"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {t("httpStatus.search")}
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("httpStatus.searchPlaceholder")}
            className="w-full rounded-sm border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          {filtered.length} {t("httpStatus.statusCodes")}
        </div>

        <div className="space-y-6">
          {grouped.map(({ group, entries }) => (
            <div key={group}>
              <div className={`mb-2 font-mono text-xs uppercase tracking-wider ${groupColors[group]?.split(" ")[0] || "text-muted"}`}>
                {group}
              </div>
              <div className="space-y-1">
                {entries.map((entry) => (
                  <button
                    key={entry.code}
                    onClick={() => copyCode(entry.code)}
                    className="group flex w-full items-start gap-3 rounded-sm border border-border bg-surface p-3 text-left transition-colors hover:border-accent/30 hover:bg-surface-raised"
                  >
                    <span className={`flex h-8 w-12 shrink-0 items-center justify-center rounded-sm border font-mono text-xs font-bold ${groupColors[group] || "text-muted border-border"}`}>
                      {entry.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {entry.name}
                        </span>
                        <span className="font-mono text-[10px] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                          {copiedCode === entry.code ? t("common.copied") : t("common.clickToCopy")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {entry.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
