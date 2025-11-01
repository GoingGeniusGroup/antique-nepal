"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import { useTheme } from "@/contexts/theme-context";
import { NavigationProvider, useNavigation } from "@/contexts/navigation-context";
import { LoadingScreen } from "@/components/loading-screen";

function ClientRootContent({ children }: PropsWithChildren) {
  const { isReady } = useTheme();
  const { isNavigating } = useNavigation();
  const [initialLoad, setInitialLoad] = useState(true);

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
      <LoadingScreen isLoading={showLoading} />
      {/* Always render children, loading screen overlays on top */}
      <div className={showLoading ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-300"}>
        {children}
      </div>
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
