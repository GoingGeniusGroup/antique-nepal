"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

/**
 * Admin Layout Component
 * 
 * Provides the main layout structure for all admin pages including:
 * - Collapsible sidebar navigation
 * - Main content area with smooth animations
 * - Responsive design for mobile and desktop
 */

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  // Prefetch admin routes for faster navigation
  useEffect(() => {
    const adminRoutes = [
      '/admin',
      '/admin/users', 
      '/admin/orders',
      '/admin/products',
      '/admin/settings'
    ];
    
    // Prefetch routes after a short delay to not block initial render
    const timeoutId = setTimeout(() => {
      adminRoutes.forEach(route => {
        router.prefetch(route);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-background to-muted/40">
      <div className="flex">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex-1 min-w-0"
        >
          <div className="px-3 sm:px-4 md:px-8 pb-6 sm:pb-10 pt-4 sm:pt-8">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
