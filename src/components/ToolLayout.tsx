"use client";

import Sidebar from "@/components/Sidebar";
import { useI18n } from "@/lib/i18n";

interface ToolLayoutProps {
  titleKey: string;
  icon: string;
  descriptionKey: string;
  children: React.ReactNode;
}

export default function ToolLayout({ titleKey, icon, descriptionKey, children }: ToolLayoutProps) {
  const { t, locale } = useI18n();
  const title = t(titleKey);
  const description = t(descriptionKey);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-[var(--sidebar-width)]">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent/10 font-mono text-sm font-bold text-accent">
                {icon}
              </div>
              <h1 className="font-mono text-xl font-bold tracking-wide text-foreground">
                {locale === "zh" ? title : title.toUpperCase()}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="mt-4 h-px bg-border" />
          </header>
          <div className="space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
