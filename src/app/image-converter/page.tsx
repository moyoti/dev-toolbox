"use client";

import { useState, useCallback, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { useI18n } from "@/lib/i18n";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp" | "image/bmp" | "image/x-icon";

interface LoadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
  format: string;
}

export default function ImageConverter() {
  const { t } = useI18n();
  const [sourceImage, setSourceImage] = useState<LoadedImage | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(80);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSourceImage({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type || "unknown",
      });
      setConvertedUrl("");
      setConvertedSize(0);
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

  const convert = useCallback(() => {
    if (!sourceImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (outputFormat === "image/jpeg" || outputFormat === "image/bmp") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const q = quality / 100;

      if (outputFormat === "image/x-icon") {
        const icoCanvas = document.createElement("canvas");
        const icoSize = Math.min(img.naturalWidth, img.naturalHeight, 256);
        icoCanvas.width = icoSize;
        icoCanvas.height = icoSize;
        const icoCtx = icoCanvas.getContext("2d");
        if (!icoCtx) return;
        icoCtx.drawImage(img, 0, 0, icoSize, icoSize);
        icoCanvas.toBlob(
          (blob) => {
            if (blob) {
              if (convertedUrl) URL.revokeObjectURL(convertedUrl);
              setConvertedUrl(URL.createObjectURL(blob));
              setConvertedSize(blob.size);
            }
          },
          "image/png"
        );
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            setConvertedUrl(URL.createObjectURL(blob));
            setConvertedSize(blob.size);
          }
        },
        outputFormat,
        outputFormat === "image/png" || outputFormat === "image/bmp" ? undefined : q
      );
    };
    img.src = sourceImage.url;
  }, [sourceImage, outputFormat, quality, convertedUrl]);

  const download = useCallback(() => {
    if (!convertedUrl) return;
    const extMap: Record<OutputFormat, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/bmp": "bmp",
      "image/x-icon": "ico",
    };
    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `converted.${extMap[outputFormat]}`;
    a.click();
  }, [convertedUrl, outputFormat]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatLabel = (fmt: string) => {
    const map: Record<string, string> = {
      "image/png": "PNG",
      "image/jpeg": "JPEG",
      "image/webp": "WebP",
      "image/bmp": "BMP",
      "image/x-icon": "ICO",
      "image/gif": "GIF",
      "image/svg+xml": "SVG",
    };
    return map[fmt] || fmt;
  };

  const showQualitySlider = outputFormat === "image/jpeg" || outputFormat === "image/webp";

  return (
    <ToolLayout
      titleKey="imageConverter.title"
      icon="⇄"
      descriptionKey="imageConverter.description"
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
          <p className="font-mono text-sm text-muted-foreground">{t("imageConverter.dropzone")}</p>
        </div>

        {sourceImage && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("imageConverter.outputFormat")}
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/bmp">BMP</option>
                  <option value="image/x-icon">ICO</option>
                </select>
              </div>
              {showQualitySlider && (
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                    {t("imageConverter.quality")}: {quality}%
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
              )}
              <div className="flex items-end">
                <button
                  onClick={convert}
                  className="w-full rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
                >
                  {t("imageConverter.converted")} → {formatLabel(outputFormat)}
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("imageConverter.inputFormat")}
                </p>
                <p className="font-mono text-lg font-bold text-foreground">
                  {formatLabel(sourceImage.format)}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatSize(sourceImage.file.size)}
                </p>
              </div>
              <div className="rounded-sm border border-border bg-surface-raised p-3 text-center">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {t("imageConverter.outputFormat")}
                </p>
                <p className="font-mono text-lg font-bold text-accent">
                  {formatLabel(outputFormat)}
                </p>
                {convertedSize > 0 && (
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatSize(convertedSize)}
                  </p>
                )}
              </div>
            </div>

            {convertedUrl && (
              <>
                <div>
                  <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
                    {t("imageConverter.preview")}
                  </label>
                  <div className="overflow-hidden rounded-sm border border-border bg-surface-raised">
                    <img src={convertedUrl} alt="Converted" className="h-auto max-h-[400px] w-full object-contain" />
                  </div>
                </div>

                <button
                  onClick={download}
                  className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
                >
                  {t("imageConverter.download")}
                </button>
              </>
            )}
          </>
        )}

        {!sourceImage && (
          <p className="font-mono text-sm text-muted">{t("imageConverter.noImage")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
