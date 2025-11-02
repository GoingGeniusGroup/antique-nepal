"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, ShoppingCart, Package, Users } from "lucide-react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

/**
 * Admin Sidebar Component
 * 
 * Features:
 * - Collapsible sidebar with smooth animations
 * - Navigation links with active state highlighting
 * - Keyboard shortcut support (Ctrl/Cmd+B)
 * - User avatar at bottom
 * - Dark theme with proper contrast
 */

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="text-white h-5 w-5 flex-shrink-0" /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingCart className="text-white h-5 w-5 flex-shrink-0" /> },
  { href: "/admin/products", label: "Products", icon: <Package className="text-white h-5 w-5 flex-shrink-0" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="text-white h-5 w-5 flex-shrink-0" /> },
  { href: "/admin/settings", label: "Site Settings", icon: <Settings className="text-white h-5 w-5 flex-shrink-0" /> },
];

// Custom SidebarLink that uses Next.js Link for smooth navigation
const CustomSidebarLink = ({ 
  href, 
  label, 
  icon, 
  isActive, 
  open 
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
        "flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md transition-all duration-200 text-white",
        isActive ? "bg-slate-800" : "hover:bg-slate-800/50"
      )}
    >
      {icon}
      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {label}
      </motion.span>
    </Link>
  );
};

export function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(!collapsed);

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
        <SidebarBody className="justify-between gap-6 sm:gap-10 bg-slate-950 border-r border-slate-800 dark:bg-slate-950"> 
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Brand Logo and text */}
            <div className="flex items-center space-x-2 py-4">
              <div className="h-7 w-7 bg-gradient-to-br from-slate-700 to-slate-900 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
              <span className="font-medium text-white whitespace-pre">
                Antique Admin
              </span>
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
          
          {/* Bottom User */}
          <div>
            <CustomSidebarLink
              href="#"
              label="Admin User"
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
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
