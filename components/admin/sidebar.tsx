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
  ChevronDown,
  Globe,
  Type,
  Tag,
  FileText,
  Building2,
  Phone,
  Share2,
  Bell,
  List,
  ShoppingBag,
} from "lucide-react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import logoImgWhite from "@/public/logo/Antique-Nepal-Logo-White-Png-3.png";
import logoTextImgWhite from "@/public/logo/Antique-Nepal-Logo-White-Png-2.png";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

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

type SubLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  subLinks?: SubLink[];
};

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  subLinks?: SubLink[];
};

const LINKS: NavLink[] = [
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
    href: "/admin/categories",
    label: "Category",
    icon: <ShoppingBag className="text-white h-5 w-5 flex-shrink-0" />,
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
    subLinks: [
      {
        href: "/admin/settings/general",
        label: "General",
        icon: <Globe className="text-white h-4 w-4 flex-shrink-0" />,
      },
      {
        href: "/admin/settings/hero",
        label: "Hero Section",
        icon: <Type className="text-white h-4 w-4 flex-shrink-0" />,
      },
      {
        href: "/admin/settings/banner",
        label: "Banner",
        icon: <Tag className="text-white h-4 w-4 flex-shrink-0" />,
      },
      {
        href: "/admin/settings/footer",
        label: "Footer",
        icon: <FileText className="text-white h-4 w-4 flex-shrink-0" />,
        subLinks: [
          {
            href: "/admin/settings/footer/brand",
            label: "Brand Info",
            icon: <Building2 className="text-white h-3 w-3 flex-shrink-0" />,
          },
          {
            href: "/admin/settings/footer/contact",
            label: "Contact",
            icon: <Phone className="text-white h-3 w-3 flex-shrink-0" />,
          },
          {
            href: "/admin/settings/footer/social",
            label: "Social Media",
            icon: <Share2 className="text-white h-3 w-3 flex-shrink-0" />,
          },
          {
            href: "/admin/settings/footer/newsletter",
            label: "Newsletter",
            icon: <Bell className="text-white h-3 w-3 flex-shrink-0" />,
          },
          {
            href: "/admin/settings/footer/navigation",
            label: "Navigation",
            icon: <List className="text-white h-3 w-3 flex-shrink-0" />,
          },
        ],
      },
    ],
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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [expandedLinks, setExpandedLinks] = useState<string[]>([]);
  const { theme, toggleTheme, isReady } = useTheme();
  const { data: session } = useSession();

  // Auto-expand settings if on a settings subpage
  useEffect(() => {
    if (pathname.startsWith("/admin/settings")) {
      const toExpand = ["/admin/settings"];

      // Also expand footer if on a footer subpage
      if (pathname.startsWith("/admin/settings/footer/")) {
        toExpand.push("/admin/settings/footer");
      }

      setExpandedLinks((prev) => {
        const newLinks = [...prev];
        toExpand.forEach((link) => {
          if (!newLinks.includes(link)) {
            newLinks.push(link);
          }
        });
        return newLinks;
      });
    }
  }, [pathname]);

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
              {/* Logo Icon */}
              <div className="relative h-7 w-7 flex-shrink-0">
                <Image
                  src={logoImgWhite}
                  alt="Antique Nepal Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Brand Name */}
              <motion.div
                animate={{
                  display: open ? "block" : "none",
                  opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative h-7 w-28"
              >
                <Image
                  src={logoTextImgWhite}
                  alt="Antique Nepal"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 flex flex-col gap-2">
              {LINKS.map((link, idx) => (
                <div key={idx}>
                  {link.subLinks ? (
                    <>
                      <button
                        onClick={() => {
                          setExpandedLinks((prev) =>
                            prev.includes(link.href)
                              ? prev.filter((l) => l !== link.href)
                              : [...prev, link.href]
                          );
                        }}
                        className={cn(
                          "flex items-center gap-2 group/sidebar py-2 rounded-md transition-all duration-300 ease-in-out text-white w-full",
                          open ? "justify-between px-3" : "justify-center px-2",
                          pathname.startsWith(link.href)
                            ? "bg-gray-700 dark:bg-gray-800"
                            : "hover:bg-gray-700/50 dark:hover:bg-gray-800/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {link.icon}
                          <motion.span
                            animate={{
                              display: open ? "inline-block" : "none",
                              opacity: open ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="text-white text-sm whitespace-pre inline-block !p-0 !m-0"
                          >
                            {link.label}
                          </motion.span>
                        </div>
                        {open && (
                          <motion.div
                            animate={{
                              rotate: expandedLinks.includes(link.href)
                                ? 180
                                : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </button>
                      <motion.div
                        initial={false}
                        animate={{
                          height:
                            expandedLinks.includes(link.href) && open
                              ? "auto"
                              : 0,
                          opacity:
                            expandedLinks.includes(link.href) && open ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-1">
                          {link.subLinks.map((subLink, subIdx) => (
                            <div key={subIdx}>
                              {subLink.subLinks ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setExpandedLinks((prev) =>
                                        prev.includes(subLink.href)
                                          ? prev.filter(
                                              (l) => l !== subLink.href
                                            )
                                          : [...prev, subLink.href]
                                      );
                                    }}
                                    className={cn(
                                      "flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200 text-white text-sm w-full justify-between",
                                      pathname.startsWith(subLink.href)
                                        ? "bg-gray-600 dark:bg-gray-700"
                                        : "hover:bg-gray-700/30 dark:hover:bg-gray-800/30"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      {subLink.icon}
                                      <span>{subLink.label}</span>
                                    </div>
                                    <ChevronDown
                                      className={cn(
                                        "h-3 w-3 transition-transform duration-200",
                                        expandedLinks.includes(subLink.href)
                                          ? "rotate-180"
                                          : ""
                                      )}
                                    />
                                  </button>
                                  {expandedLinks.includes(subLink.href) && (
                                    <div className="ml-4 mt-1 space-y-1">
                                      {subLink.subLinks.map(
                                        (nestedLink, nestedIdx) => (
                                          <Link
                                            key={nestedIdx}
                                            href={nestedLink.href}
                                            className={cn(
                                              "flex items-center gap-2 py-1.5 px-3 rounded-md transition-all duration-200 text-white text-xs",
                                              pathname === nestedLink.href
                                                ? "bg-gray-500 dark:bg-gray-600"
                                                : "hover:bg-gray-700/20 dark:hover:bg-gray-800/20"
                                            )}
                                          >
                                            {nestedLink.icon}
                                            <span>{nestedLink.label}</span>
                                          </Link>
                                        )
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <Link
                                  href={subLink.href}
                                  className={cn(
                                    "flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200 text-white text-sm",
                                    pathname === subLink.href
                                      ? "bg-gray-600 dark:bg-gray-700"
                                      : "hover:bg-gray-700/30 dark:hover:bg-gray-800/30"
                                  )}
                                >
                                  {subLink.icon}
                                  <span>{subLink.label}</span>
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <CustomSidebarLink
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      isActive={pathname === link.href}
                      open={open}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom User Profile & Logout */}
          <div className="space-y-2">
            <CustomSidebarLink
              href="/admin/profile"
              label={session?.user?.name || "Admin Profile"}
              icon={
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {session?.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
              }
              isActive={pathname === "/admin/profile"}
              open={open}
            />
            {/* logout button */}
            <button
              onClick={() => setShowLogoutDialog(true)}
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

      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={() => {
          toast.success("Logging out...", {
            duration: 2000,
            position: "bottom-right",
          });
          setTimeout(() => {
            signOut({ callbackUrl: "/admin/login" });
          }, 500);
        }}
        title="Logout Confirmation"
        description="Are you sure you want to logout from the admin panel?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
