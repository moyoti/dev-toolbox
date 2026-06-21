"use client";

import { useState, useCallback, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

interface ImageData {
  file: File;
  url: string;
  width: number;
  height: number;
}

export default function ImageCompressor() {
  const { t } = useI18n();
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/jpeg");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginalImage({ file, url, width: img.naturalWidth, height: img.naturalHeight });
      setCompressedUrl("");
      setCompressedSize(0);
    };
    img.src = url;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const compress = useCallback(() => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      const mw = maxWidth ? parseInt(maxWidth, 10) : 0;
      const mh = maxHeight ? parseInt(maxHeight, 10) : 0;

      if (mw > 0 && targetWidth > mw) {
        const ratio = mw / targetWidth;
        targetWidth = mw;
        targetHeight = Math.round(targetHeight * ratio);
      }
      if (mh > 0 && targetHeight > mh) {
        const ratio = mh / targetHeight;
        targetHeight = mh;
        targetWidth = Math.round(targetWidth * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const q = quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            const newUrl = URL.createObjectURL(blob);
            setCompressedUrl(newUrl);
            setCompressedSize(blob.size);
          }
        },
        outputFormat,
        outputFormat === "image/png" ? undefined : q
      );
    };
    img.src = originalImage.url;
  }, [originalImage, quality, maxWidth, maxHeight, outputFormat, compressedUrl]);

  const download = useCallback(() => {
    if (!compressedUrl) return;
    const ext = outputFormat.split("/")[1];
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed.${ext}`;
    a.click();
  }, [compressedUrl, outputFormat]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const savingsPercent = originalImage && compressedSize > 0
    ? Math.round((1 - compressedSize / originalImage.file.size) * 100)
    : 0;

  const formatLabel = (fmt: OutputFormat) => {
    switch (fmt) {
      case "image/jpeg": return "JPEG";
      case "image/png": return "PNG";
      case "image/webp": return "WebP";
    }
  };

  return (
    <ToolLayout
      titleKey="imageCompressor.title"
      icon="img"
      descriptionKey="imageCompressor.description"
    >
      <div className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-md border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? "border-accent bg-accent/5" : "border-border bg-surface-raised hover:border-accent/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="font-mono text-sm text-muted-foreground">{t("imageCompressor.dropzone")}</p>
        </div>

        {originalImage && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("imageCompressor.outputFormat")}
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("imageCompressor.quality")}: {quality}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("imageCompressor.maxWidth")} <span className="text-muted">({t("imageCompressor.optional")})</span>
                </label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  placeholder={`${originalImage.width}px`}
                  className="w-full rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("imageCompressor.maxHeight")} <span className="text-muted">({t("imageCompressor.optional")})</span>
                </label>
                <input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                  placeholder={`${originalImage.height}px`}
                  className="w-full rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={compress}
              className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
            >
              {t("common.format")} → {formatLabel(outputFormat)}
            </button>

            {compressedUrl && (
              <>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
                      {t("imageCompressor.before")}
                    </label>
                    <div className="overflow-hidden rounded-sm border border-border bg-surface-raised">
                      <img src={originalImage.url} alt="Original" className="h-auto w-full object-contain" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
                      {t("imageCompressor.after")}
                    </label>
                    <div className="overflow-hidden rounded-sm border border-border bg-surface-raised">
                      <img src={compressedUrl} alt="Compressed" className="h-auto w-full object-contain" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {t("imageCompressor.originalSize")}
                    </p>
                    <p className="font-mono text-lg font-bold text-foreground">
                      {formatSize(originalImage.file.size)}
                    </p>
                  </div>
                  <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {t("imageCompressor.compressedSize")}
                    </p>
                    <p className="font-mono text-lg font-bold text-foreground">
                      {formatSize(compressedSize)}
                    </p>
                  </div>
                  <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {t("imageCompressor.savings")}
                    </p>
                    <p className={`font-mono text-lg font-bold ${savingsPercent > 0 ? "text-success" : "text-warning"}`}>
                      {savingsPercent > 0 ? `-${savingsPercent}%` : `${Math.abs(savingsPercent)}%`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={download}
                  className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
                >
                  {t("imageCompressor.download")}
                </button>
              </>
            )}
          </>
        )}

        {!originalImage && (
          <p className="font-mono text-sm text-muted">{t("imageCompressor.noImage")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
