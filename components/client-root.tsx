"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import { useTheme } from "@/contexts/theme-context";
import { NavigationProvider, useNavigation } from "@/contexts/navigation-context";
import { LoadingScreen } from "@/components/loading-screen";
import { Navbar } from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollNav } from "@/components/scroll-nav";
import { usePathname } from "next/navigation";

function ClientRootContent({ children }: PropsWithChildren) {
  const { isReady } = useTheme();
  const { isNavigating } = useNavigation();
  const [initialLoad, setInitialLoad] = useState(true);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isReady) {
      // Delay hiding initial load to ensure smooth transition
      const timer = setTimeout(() => setInitialLoad(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  const showLoading = initialLoad || isNavigating;

  return (
    <div className="relative">
      {!isAdmin && <Navbar />}
      <LoadingScreen isLoading={showLoading} />
      {/* Always render children, loading screen overlays on top */}
      <div className={showLoading ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-300"}>
        {children}
      </div>
      {!isAdmin && (
        <>
          <ThemeToggle
            variant="fixed"
            position="right-4 md:right-8 top-1/2 -translate-y-1/2"
            zIndex={50}
          />
          <ScrollNav zIndex={40} />
        </>
      )}
    </div>
  );
}

export function ClientRoot({ children }: PropsWithChildren) {
  return (
    <NavigationProvider>
      <ClientRootContent>{children}</ClientRootContent>
    </NavigationProvider>
  );
}

