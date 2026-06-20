"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type Algorithm = "SHA-256" | "SHA-1" | "SHA-512" | "MD5";

function md5(input: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  const inputBytes = new TextEncoder().encode(input);
  const len = inputBytes.length;

  const bitLen = len * 8;
  const padLen = ((56 - (len + 1) % 64) + 64) % 64;
  const totalLen = len + 1 + padLen + 8;
  const bytes = new Uint8Array(totalLen);
  bytes.set(inputBytes);
  bytes[len] = 0x80;
  const dv = new DataView(bytes.buffer);
  dv.setUint32(totalLen - 8, bitLen >>> 0, true);
  dv.setUint32(totalLen - 4, (bitLen / 0x100000000) >>> 0, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const T = [0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391];

  for (let offset = 0; offset < totalLen; offset += 64) {
    const M = new Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = dv.getUint32(offset + j * 4, true);
    }

    let A = a0, B = b0, C = c0, D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      if (i < 16) { F = md5ff(A, B, C, D, M[i], S[i], T[i]); g = i; }
      else if (i < 32) { F = md5gg(A, B, C, D, M[(5 * i + 1) % 16], S[i], T[i]); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = md5hh(A, B, C, D, M[(3 * i + 5) % 16], S[i], T[i]); g = (3 * i + 5) % 16; }
      else { F = md5ii(A, B, C, D, M[(7 * i) % 16], S[i], T[i]); g = (7 * i) % 16; }
      D = C; C = B; B = F; A = D;
    }

    a0 = safeAdd(a0, A);
    b0 = safeAdd(b0, B);
    c0 = safeAdd(c0, C);
    d0 = safeAdd(d0, D);
  }

  const result = [a0, b0, c0, d0]
    .map((v) => (v >>> 0).toString(16).padStart(8, "0"))
    .join("");
  return result;
}

async function computeHash(algorithm: Algorithm, input: string): Promise<string> {
  if (algorithm === "MD5") {
    return md5(input);
  }
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hashOutput, setHashOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [compareInput, setCompareInput] = useState("");

  const generateHash = useCallback(async () => {
    if (!input.trim()) {
      setHashOutput("");
      return;
    }
    const result = await computeHash(algorithm, input);
    setHashOutput(result);
  }, [input, algorithm]);

  const copyOutput = useCallback(() => {
    if (hashOutput) {
      navigator.clipboard.writeText(hashOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [hashOutput]);

  const hashMatch = hashOutput && compareInput.trim()
    ? hashOutput.toLowerCase() === compareInput.trim().toLowerCase()
    : null;

  return (
    <ToolLayout
      titleKey="hash.title"
      icon="#"
      descriptionKey="hash.description"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("hash.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("hash.placeholder")}
            className="min-h-[120px] w-full resize-y rounded-md border border-border bg-surface-raised p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {t("hash.algorithm")}
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              className="rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs text-foreground"
            >
              <option value="MD5">MD5</option>
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
          <button
            onClick={generateHash}
            className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
          >
            {t("common.generate")}
          </button>
        </div>

        {hashOutput && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                {t("hash.output")}
              </label>
              <button
                onClick={copyOutput}
                className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {copied ? t("common.copied") : t("common.copy")}
              </button>
            </div>
            <div className="rounded-md border border-border bg-surface-raised p-4">
              <code className="break-all font-mono text-sm text-accent">{hashOutput}</code>
            </div>
          </div>
        )}

        {hashOutput && (
          <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4">
            <label className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("hash.compare")}
            </label>
            <input
              type="text"
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              placeholder={t("hash.comparePlaceholder")}
              className="w-full rounded-sm border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {hashMatch !== null && (
              <span className={`font-mono text-xs ${hashMatch ? "text-success" : "text-error"}`}>
                {hashMatch ? t("hash.match") : t("hash.noMatch")}
              </span>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
