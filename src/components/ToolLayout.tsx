import Sidebar from "@/components/Sidebar";

interface ToolLayoutProps {
  title: string;
  icon: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, icon, description, children }: ToolLayoutProps) {
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
                {title.toUpperCase()}
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
