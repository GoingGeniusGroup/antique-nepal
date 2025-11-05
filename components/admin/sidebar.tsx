"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Package,
  Users,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

/**
 * Admin Sidebar Component
 *
 * Features:
 * - Collapsible sidebar with smooth animations
 * - Navigation links with active state highlighting
 * - Keyboard shortcut support (Ctrl/Cmd+B)
 * - Built-in dark/light mode toggle
 * - User avatar at bottom
 * - Responsive theme switching
 */

const LINKS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="text-white h-5 w-5 flex-shrink-0" />,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: <ShoppingCart className="text-white h-5 w-5 flex-shrink-0" />,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: <Package className="text-white h-5 w-5 flex-shrink-0" />,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Users className="text-white h-5 w-5 flex-shrink-0" />,
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    icon: <Settings className="text-white h-5 w-5 flex-shrink-0" />,
  },
];

// Custom SidebarLink that uses Next.js Link for smooth navigation
const CustomSidebarLink = ({
  href,
  label,
  icon,
  isActive,
  open,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  open: boolean;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 group/sidebar py-2 rounded-md transition-all duration-300 ease-in-out text-white",
        open ? "justify-start px-3" : "justify-center px-2",
        isActive
          ? "bg-gray-700 dark:bg-gray-800"
          : "hover:bg-gray-700/50 dark:hover:bg-gray-800/50"
      )}
    >
      {icon}
      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-300 ease-in-out whitespace-pre inline-block !p-0 !m-0"
      >
        {label}
      </motion.span>
    </Link>
  );
};

export function AdminSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(!collapsed);
  const { theme, toggleTheme, isReady } = useTheme();

  // Keep open state in sync with collapsed prop (Ctrl/Cmd+B)
  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggle]);

  return (
    <div className="sticky top-0 h-screen z-20">
      <Sidebar open={open} setOpen={setOpen} animate>
        <SidebarBody
          className={cn(
            "justify-between gap-6 sm:gap-10 !bg-gray-800 dark:!bg-gray-900 transition-all duration-500 ease-in-out",
            open ? "px-4" : "px-2"
          )}
        >
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Brand Logo and text */}
            <div
              className={cn(
                "flex items-center py-4 transition-all duration-500 ease-in-out",
                open ? "space-x-2 justify-start" : "justify-center"
              )}
            >
              <div className="h-7 w-7 bg-gradient-to-br from-primary/20 to-primary/40 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="font-medium text-white whitespace-pre"
              >
                Antique Admin
              </motion.span>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 flex flex-col gap-2">
              {LINKS.map((link, idx) => (
                <CustomSidebarLink
                  key={idx}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  isActive={pathname === link.href}
                  open={open}
                />
              ))}
            </div>
          </div>

          {/* Bottom User Profile & Logout */}
          <div className="space-y-2">
            <CustomSidebarLink
              href="/admin/profile"
              label="Admin Profile"
              icon={
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              }
              isActive={false}
              open={open}
            />
            {/* logout button */}
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className={cn(
                "flex items-center gap-2 group/sidebar py-2 rounded-md transition-all duration-300 ease-in-out text-white w-full",
                open ? "justify-start px-3" : "justify-center px-2",
                "hover:bg-red-600/50 dark:hover:bg-red-700/50"
              )}
            >
              <LogOut className="text-white h-5 w-5 flex-shrink-0" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-300 ease-in-out whitespace-pre inline-block !p-0 !m-0"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
