"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ShoppingBag,
  Heart,
  Search,
  LogOut,
  User,
  ArrowRight,
  ChevronRight,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useGeneralSettings } from "@/contexts/settings-context";
import navigationData from "@/data/navigation.json";
import { signOut, useSession } from "next-auth/react";
import logoImgDark from "@/public/logo/Antique-Nepal-Logo-2.png";
import logoImgWhite from "@/public/logo/Antique-Nepal-Logo-White-Png-3.png";
import toast from "react-hot-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  color?: string;
  count?: number;
}

type ActiveNavMenu = "categories" | "stories" | "search" | "bag" | null;

export const Navbar = () => {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveNavMenu>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { stories } = navigationData;
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";
  const pathname = usePathname();
  const userId = session?.user?.id;
  const { general } = useGeneralSettings();
  const navRef = useRef<HTMLElement>(null);

  const logoIconSrc =
    general.logo && typeof general.logo === "string"
      ? general.logo
      : isDark
      ? logoImgWhite
      : logoImgDark;

  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showCartBadge, setShowCartBadge] = useState(false);
  const [showWishlistBadge, setShowWishlistBadge] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  // Fetch cart and wishlist counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!userId || isAdmin) {
        setCartCount(0);
        setWishlistCount(0);
        setShowCartBadge(false);
        setShowWishlistBadge(false);
        return;
      }

      try {
        const cartRes = await fetch(`/api/cart`);
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          const count = cartData?.cart?.items?.length || 0;
          setCartCount(count);
          localStorage.setItem("cartCount", count.toString());
          const cartVisited = localStorage.getItem("cartVisited");
          setShowCartBadge(count > 0 && cartVisited !== "true");
        }

        const wishlistRes = await fetch(`/api/wishlist?userId=${userId}`);
        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          const count = wishlistData?.items?.length || 0;
          setWishlistCount(count);
          localStorage.setItem("wishlistCount", count.toString());
          const wishlistVisited = localStorage.getItem("wishlistVisited");
          setShowWishlistBadge(count > 0 && wishlistVisited !== "true");
        }
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      }
    };

    if (userId && !isAdmin) {
      const cachedCartCount = parseInt(localStorage.getItem("cartCount") || "0");
      const cachedWishlistCount = parseInt(localStorage.getItem("wishlistCount") || "0");
      const cartVisited = localStorage.getItem("cartVisited");
      const wishlistVisited = localStorage.getItem("wishlistVisited");

      setCartCount(cachedCartCount);
      setWishlistCount(cachedWishlistCount);
      setShowCartBadge(cachedCartCount > 0 && cartVisited !== "true");
      setShowWishlistBadge(cachedWishlistCount > 0 && wishlistVisited !== "true");
    }

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [userId, isAdmin]);

  // Clear badges when visiting cart or wishlist
  useEffect(() => {
    if (pathname === "/carts" || pathname === "/cart") {
      localStorage.setItem("cartVisited", "true");
      setShowCartBadge(false);
    } else if (pathname === "/wishlist") {
      localStorage.setItem("wishlistVisited", "true");
      setShowWishlistBadge(false);
    }
  }, [pathname]);

  return (
    <>
      {/* ────────────────── APPLE-STYLE GLOBAL NAVIGATION ────────────────── */}
      <header
        ref={navRef}
        onMouseLeave={() => setActiveMenu(null)}
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 select-none bg-[rgba(250,248,245,0.85)] dark:bg-[rgba(20,20,22,0.85)] backdrop-blur-2xl backdrop-saturate-180 border-b border-black/[0.08] dark:border-white/[0.08]"
      >
        <div className="max-w-[1024px] mx-auto px-4 sm:px-8 h-12 flex items-center justify-between font-sans">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Antique Nepal Home"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <div className="relative w-5 h-5">
              <Image
                src={logoIconSrc}
                alt="Antique Nepal"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif font-bold tracking-wider text-xs hidden sm:inline text-stone-900 dark:text-stone-100">
              ANTIQUE NEPAL
            </span>
          </Link>

          {/* Desktop Nav Items (Home, Categories, Shop, Stories) */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 text-[12px] text-stone-700 dark:text-stone-300 font-normal">
            <Link
              href="/"
              className={`transition-opacity duration-150 hover:opacity-100 ${
                pathname === "/" ? "text-stone-950 dark:text-white font-medium opacity-100" : "opacity-80"
              }`}
            >
              Home
            </Link>

            {/* Categories trigger */}
            <button
              onMouseEnter={() => setActiveMenu("categories")}
              onClick={() => setActiveMenu(activeMenu === "categories" ? null : "categories")}
              className={`transition-opacity duration-150 hover:opacity-100 ${
                activeMenu === "categories" ? "text-stone-950 dark:text-white font-medium opacity-100" : "opacity-80"
              }`}
            >
              Categories
            </button>

            {/* Shop */}
            <Link
              href="/products"
              className={`transition-opacity duration-150 hover:opacity-100 ${
                pathname === "/products" ? "text-stone-950 dark:text-white font-medium opacity-100" : "opacity-80"
              }`}
            >
              Shop
            </Link>

            {/* Stories trigger */}
            <button
              onMouseEnter={() => setActiveMenu("stories")}
              onClick={() => setActiveMenu(activeMenu === "stories" ? null : "stories")}
              className={`transition-opacity duration-150 hover:opacity-100 ${
                activeMenu === "stories" ? "text-stone-950 dark:text-white font-medium opacity-100" : "opacity-80"
              }`}
            >
              Stories
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5 text-stone-700 dark:text-stone-300">
            {/* Search Button */}
            <button
              aria-label="Search"
              onClick={() => setActiveMenu(activeMenu === "search" ? null : "search")}
              className="opacity-80 hover:opacity-100 transition-opacity p-1"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            {!isAdmin && (
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative opacity-80 hover:opacity-100 transition-opacity p-1"
              >
                <Heart className="w-4 h-4" />
                {showWishlistBadge && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-1 bg-amber-600 dark:bg-amber-500 text-white dark:text-stone-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Bag / Cart */}
            {!isAdmin && (
              <button
                aria-label="Shopping Bag"
                onClick={() => setActiveMenu(activeMenu === "bag" ? null : "bag")}
                className="relative opacity-80 hover:opacity-100 transition-opacity p-1"
              >
                <ShoppingBag className="w-4 h-4" />
                {showCartBadge && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-1 bg-amber-600 dark:bg-amber-500 text-white dark:text-stone-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Auth */}
            {!session || (session.user as any)?.role === "ADMIN" ? (
              <div className="hidden sm:flex items-center space-x-3 text-[12px]">
                <Link
                  href="/login"
                  className="opacity-80 hover:opacity-100 transition-opacity font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white rounded-full text-[11px] font-medium transition-all"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setActiveMenu(activeMenu === "bag" ? null : "bag")}
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                <Avatar className="w-6 h-6 border border-stone-300 dark:border-stone-700">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="text-[10px] bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-bold">
                    {session.user?.name?.slice(0, 1) || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              aria-label="Toggle Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden opacity-80 hover:opacity-100 transition-opacity p-1"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <div className="w-4 h-3 flex flex-col justify-between">
                  <span className="w-full h-[1.5px] bg-current rounded-full" />
                  <span className="w-full h-[1.5px] bg-current rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* ────────────────── APPLE-STYLE CLEAN FLYOUT MENUS ────────────────── */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden bg-[rgba(250,248,245,0.96)] dark:bg-[rgba(20,20,22,0.96)] backdrop-blur-3xl border-t border-black/[0.04] dark:border-white/[0.04] shadow-2xl"
            >
              <div className="max-w-[1024px] mx-auto px-6 py-8">
                {/* 1. CLEAN STORIES FLYOUT */}
                {activeMenu === "stories" && (
                  <div className="max-w-xl mx-auto py-2">
                    <p className="text-[11px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold mb-4">
                      Stories
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {stories.map((story) => (
                        <li key={story.id}>
                          <Link
                            href={story.href}
                            onClick={() => setActiveMenu(null)}
                            className="group block"
                          >
                            <span className="text-lg sm:text-xl font-serif font-light text-stone-800 dark:text-stone-200 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors block leading-tight">
                              {story.name}
                            </span>
                            <span className="text-xs text-stone-500 dark:text-stone-400 font-sans font-light">
                              {story.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. CLEAN CATEGORIES FLYOUT */}
                {activeMenu === "categories" && (
                  <div className="max-w-xl mx-auto py-2">
                    <p className="text-[11px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold mb-4">
                      Categories
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/category/${category.slug}`}
                            onClick={() => setActiveMenu(null)}
                            className="group block"
                          >
                            <span className="text-lg sm:text-xl font-serif font-light text-stone-800 dark:text-stone-200 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors block leading-tight">
                              {category.name}
                            </span>
                            {category.description && (
                              <span className="text-xs text-stone-500 dark:text-stone-400 font-sans font-light line-clamp-1">
                                {category.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                      <Link
                        href="/category"
                        onClick={() => setActiveMenu(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        <span>View All Categories</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* 3. SEARCH FLYOUT */}
                {activeMenu === "search" && (
                  <div className="max-w-xl mx-auto py-4 space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                          window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                        }
                      }}
                      className="relative flex items-center"
                    >
                      <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-sm focus:outline-none focus:border-amber-600 dark:focus:border-amber-400 text-stone-900 dark:text-white font-sans"
                      />
                    </form>
                  </div>
                )}

                {/* 4. BAG / ACCOUNT FLYOUT */}
                {activeMenu === "bag" && (
                  <div className="max-w-md mx-auto py-2 space-y-5 font-sans">
                    {session ? (
                      <div className="p-3.5 rounded-xl bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-xs text-stone-900 dark:text-white">
                            {session.user?.name}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href="/profile"
                            onClick={() => setActiveMenu(null)}
                            className="text-xs px-3 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-full font-medium transition-colors"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              setActiveMenu(null);
                              setShowLogoutDialog(true);
                            }}
                            className="text-xs px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full font-medium transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 dark:text-stone-400">Your Bag:</span>
                        <span className="font-bold text-stone-900 dark:text-white">
                          {cartCount} {cartCount === 1 ? "Item" : "Items"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <Link
                          href="/carts"
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center justify-center py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-xs font-semibold transition-all"
                        >
                          Review Bag
                        </Link>
                        <Link
                          href="/checkout"
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center justify-center py-2 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition-all"
                        >
                          Check Out
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                        <Link
                          href="/wishlist"
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center justify-between py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400"
                        >
                          <span>Saved Items (Wishlist)</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ────────────────── APPLE-STYLE MOBILE DRAWER ────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-12 z-40 bg-[rgba(250,248,245,0.98)] dark:bg-[rgba(15,15,18,0.98)] backdrop-blur-2xl p-6 flex flex-col justify-between overflow-y-auto md:hidden font-sans"
          >
            <div className="space-y-6 pt-4">
              <nav className="space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-serif font-light text-stone-900 dark:text-white"
                >
                  Home
                </Link>
                <Link
                  href="/category"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-serif font-light text-stone-900 dark:text-white"
                >
                  Categories
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-serif font-light text-stone-900 dark:text-white"
                >
                  Shop
                </Link>

                <div className="pl-3 pt-2 space-y-2 border-l border-stone-200 dark:border-stone-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Stories</p>
                  {stories.map((story) => (
                    <Link
                      key={story.id}
                      href={story.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-serif text-stone-700 dark:text-stone-300"
                    >
                      {story.name}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <Link
                  href="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm text-stone-700 dark:text-stone-300 py-2"
                >
                  <Search className="w-4 h-4 text-stone-400" />
                  <span>Search Products</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm text-stone-700 dark:text-stone-300 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-stone-400" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/carts"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm text-stone-700 dark:text-stone-300 py-2"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-stone-400" />
                    <span>Shopping Bag</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
              {!session ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-full bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 text-xs font-bold"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{session.user?.name}</p>
                    <p className="text-xs text-stone-500">{session.user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogoutDialog(true);
                    }}
                    className="text-xs text-red-500 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dim overlay when desktop dropdown is open */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMenu(null)}
            className="fixed inset-0 top-12 z-30 bg-black/35 backdrop-blur-[2px] hidden md:block"
          />
        )}
      </AnimatePresence>

      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={async () => {
          localStorage.removeItem("cartCount");
          localStorage.removeItem("wishlistCount");
          localStorage.removeItem("cartVisited");
          localStorage.removeItem("wishlistVisited");

          setCartCount(0);
          setWishlistCount(0);
          setShowCartBadge(false);
          setShowWishlistBadge(false);

          await signOut({ callbackUrl: "/" });
          sessionStorage.removeItem("loginSuccessToastShown");
          toast.success("Logged out successfully!", {
            duration: 2000,
            position: "bottom-right",
          });
        }}
        title="Logout Confirmation"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};
