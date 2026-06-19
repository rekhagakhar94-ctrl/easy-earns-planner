import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, History, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { CurrencySwitcher } from "./CurrencySwitcher";

const NAV = [
  { to: "/", label: "Tools", icon: LayoutGrid },
  { to: "/history", label: "History", icon: History },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function useKeyboardAwareNav() {
  useEffect(() => {
    const isField = (el: Element | null) =>
      !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT");
    const onFocusIn = (e: FocusEvent) => {
      if (isField(e.target as Element)) document.body.classList.add("kb-open");
    };
    const onFocusOut = () => {
      setTimeout(() => {
        if (!isField(document.activeElement)) document.body.classList.remove("kb-open");
      }, 120);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    const vv = window.visualViewport;
    const onResize = () => {
      const kbOpen = vv ? window.innerHeight - vv.height > 150 : false;
      document.body.classList.toggle("kb-open", kbOpen && isField(document.activeElement));
    };
    vv?.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      vv?.removeEventListener("resize", onResize);
      document.body.classList.remove("kb-open");
    };
  }, []);
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useKeyboardAwareNav();
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <main className="app-main flex-1 px-5 pb-28 pt-6">{children}</main>
        <nav className="app-nav fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-4">
          <div className="glass-card flex items-center justify-around px-2 py-2 backdrop-blur">
            {NAV.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({
  label,
  title,
  subtitle,
  back = true,
  right,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start gap-3">
      {back && (
        <Link
          to="/"
          className="mt-1 inline-flex size-10 items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:bg-surface-2"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
      <div className="flex-1">
        {label && <p className="section-label">{label}</p>}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right ?? <CurrencySwitcher compact />}
    </header>
  );
}
