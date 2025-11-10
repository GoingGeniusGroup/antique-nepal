"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useTheme } from "@/contexts/theme-context";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin Layout Component
 *
 * Provides the main layout structure for all admin pages including:
 * - Collapsible sidebar navigation
 * - Main content area with smooth animations
 * - Responsive design for mobile and desktop
 * - Toast notifications
 */

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, toggleTheme, isReady } = useTheme();

  // Auth check - skip for login/signup pages
  useEffect(() => {
    const isAuthPage =
      pathname === "/admin/login" || pathname === "/admin/signup";

    if (isAuthPage || status === "loading") return;

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, pathname, router]);

  // Prefetch admin routes for faster navigation
  useEffect(() => {
    const adminRoutes = [
      "/admin",
      "/admin/users",
      "/admin/orders",
      "admin/categories",
      "/admin/products",
      "/admin/settings",
    ];

    // Prefetch routes after a short delay to not block initial render
    const timeoutId = setTimeout(() => {
      adminRoutes.forEach((route) => {
        router.prefetch(route);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  // Check if we're on auth pages (login/signup)
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/signup";

  return (
    <div
      className={`min-h-dvh w-full ${
        isAuthPage ? "bg-transparent" : "bg-background dark:!bg-slate-900"
      }`}
    >
      <div className="flex h-full">
        {!isAuthPage && (
          <AdminSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
          />
        )}
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`flex-1 min-w-0 relative ${
            isAuthPage
              ? "w-full bg-transparent"
              : "bg-gradient-to-b from-background to-muted/20 dark:!bg-gradient-to-b dark:!from-slate-900 dark:!to-slate-800"
          }`}
        >
          {/* Theme Toggle - Middle Right */}
          {isReady && (
            <div className="fixed top-1/2 right-4 -translate-y-1/2 z-30">
              <motion.button
                onClick={toggleTheme}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "rounded-full p-3 backdrop-blur-md shadow-lg border transition-all",
                  theme === "dark"
                    ? "bg-slate-800/80 border-slate-600/50 hover:bg-slate-700/80"
                    : "bg-[#f7f5f2]/80 border-[#e8e0d8] hover:bg-white/90"
                )}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 md:h-6 md:w-6 text-blue-300" />
                ) : (
                  <Sun className="h-5 w-5 md:h-6 md:w-6 text-[#2d2520]" />
                )}
              </motion.button>
            </div>
          )}

          <div
            className={
              isAuthPage
                ? ""
                : "px-3 sm:px-4 md:px-8 pb-6 sm:pb-10 pt-4 sm:pt-8"
            }
          >
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
