"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

type GenType = "paragraphs" | "sentences" | "words";

const baseWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "aut", "odit", "fugit",
  "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt",
  "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam", "eius", "modi",
  "tempora", "magnam", "quaerat", "minima", "nostrum", "exercitationem",
  "ullam", "corporis", "suscipit", "laboriosam", "nihil", "consequatur",
  "vel", "illum", "blanditiis", "praesentium", "voluptatum", "deleniti", "atque",
  "corrupti", "quos", "quas", "molestias", "excepturi", "occaecati", "cupiditate",
  "provident", "similique", "mollitia", "animi", "harum", "rerum", "necesssitatis",
];

function randomWord(): string {
  return baseWords[Math.floor(Math.random() * baseWords.length)];
}

function generateSentence(wordCount?: number): string {
  const count = wordCount || (Math.floor(Math.random() * 10) + 6);
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(randomWord());
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(sentenceCount?: number): string {
  const count = sentenceCount || (Math.floor(Math.random() * 4) + 4);
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

const classicOpening = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export default function LoremIpsum() {
  const [genType, setGenType] = useState<GenType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const num = Math.min(Math.max(count, 1), 100);
    let result = "";

    switch (genType) {
      case "paragraphs": {
        const paragraphs: string[] = [];
        for (let i = 0; i < num; i++) {
          let para = generateParagraph();
          if (i === 0 && startWithLorem) {
            const rest = para.split(" ").slice(8).join(" ");
            para = classicOpening + (rest ? " " + rest : "");
          }
          paragraphs.push(para);
        }
        result = paragraphs.join("\n\n");
        break;
      }
      case "sentences": {
        const sentences: string[] = [];
        for (let i = 0; i < num; i++) {
          if (i === 0 && startWithLorem) {
            sentences.push(classicOpening);
          } else {
            sentences.push(generateSentence());
          }
        }
        result = sentences.join(" ");
        break;
      }
      case "words": {
        const words: string[] = [];
        if (startWithLorem) {
          const loremWords = classicOpening.replace(/[.,]/g, "").split(" ");
          const loremCount = Math.min(num, loremWords.length);
          for (let i = 0; i < loremCount; i++) {
            words.push(loremWords[i].toLowerCase());
          }
          for (let i = loremCount; i < num; i++) {
            words.push(randomWord());
          }
        } else {
          for (let i = 0; i < num; i++) {
            words.push(randomWord());
          }
        }
        result = words.join(" ");
        break;
      }
    }

    setOutput(result);
  }, [genType, count, startWithLorem]);

  const copyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  return (
    <ToolLayout
      title="Lorem Ipsum"
      icon="Lip"
      description="Generate placeholder text for designs and layouts"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Type
            </label>
            <select
              value={genType}
              onChange={(e) => setGenType(e.target.value as GenType)}
              className="rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-xs text-foreground"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Count
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 rounded-sm border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="h-4 w-4 rounded-sm border-border accent-accent"
            />
            <span className="font-mono text-xs text-muted-foreground">
              Start with &quot;Lorem ipsum...&quot;
            </span>
          </label>
          <button
            onClick={generate}
            className="rounded-sm border border-accent bg-accent/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
          >
            Generate
          </button>
        </div>

        {output && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                Output
              </label>
              <button
                onClick={copyOutput}
                className="rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <div className="max-h-[500px] overflow-auto rounded-md border border-border bg-surface-raised p-4 font-mono text-sm leading-relaxed text-foreground">
              {output}
            </div>
            <div className="flex items-center gap-4 rounded-md border border-border bg-surface p-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Stats
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {output.split(/\s+/).length} words
              </span>
              <span className="text-border">|</span>
              <span className="font-mono text-xs text-muted-foreground">
                {output.length} chars
              </span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
