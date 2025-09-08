import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { PWAInstallPrompt, PWAStatus } from "./PWAInstallPrompt";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  // Demo mode for testing mobile UI
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  if (!user && !isDemoMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pb-24 md:pb-4 md:ml-64 pt-4 md:pt-0">
        {children}
      </main>
      <PWAInstallPrompt />
      <PWAStatus />
    </div>
  );
}