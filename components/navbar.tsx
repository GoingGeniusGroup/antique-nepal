"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  Heart,
  Search,
  LogOut,
} from "lucide-react";

import { useGeneralSettings } from "@/contexts/settings-context";
import navigationData from "@/data/navigation.json";
import { signOut, useSession } from "next-auth/react";
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

interface Story {
  id: number;
  name: string;
  href: string;
  description: string;
  image: string;
}

export const Navbar = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const stories: Story[] = navigationData.stories;
  const settingsContext = useGeneralSettings();

  const general = settingsContext?.general || {};

  const pathname = usePathname();
  const userId = session?.user?.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showCartBadge, setShowCartBadge] = useState(false);
  const [showWishlistBadge, setShowWishlistBadge] = useState(false);

  // Set mounted flag on client side
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Close mobile navigation drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  const fetchCounts = useCallback(async () => {
    if (!userId || isAdmin) {
      setCartCount(0);
      setWishlistCount(0);
      setShowCartBadge(false);
      setShowWishlistBadge(false);
      return;
    }

    try {
      const [cartRes, wishlistRes] = await Promise.all([
        fetch(`/api/cart`),
        fetch(`/api/wishlist?userId=${userId}`),
      ]);

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const count = cartData?.cart?.items?.length || 0;
        setCartCount(count);
        if (typeof window !== "undefined") {
          localStorage.setItem("cartCount", count.toString());
          const cartVisited = localStorage.getItem("cartVisited");
          setShowCartBadge(count > 0 && cartVisited !== "true");
        }
      }

      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        const count = wishlistData?.items?.length || 0;
        setWishlistCount(count);
        if (typeof window !== "undefined") {
          localStorage.setItem("wishlistCount", count.toString());
          const wishlistVisited = localStorage.getItem("wishlistVisited");
          setShowWishlistBadge(count > 0 && wishlistVisited !== "true");
        }
      }
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  }, [userId, isAdmin]);

  useEffect(() => {
    if (!hasMounted) return;

    if (userId && !isAdmin) {
      const cachedCartCount = parseInt(
        localStorage.getItem("cartCount") || "0",
        10
      );
      const cachedWishlistCount = parseInt(
        localStorage.getItem("wishlistCount") || "0",
        10
      );
      const cartVisited = localStorage.getItem("cartVisited");
      const wishlistVisited = localStorage.getItem("wishlistVisited");

      setCartCount(cachedCartCount);
      setWishlistCount(cachedWishlistCount);
      setShowCartBadge(cachedCartCount > 0 && cartVisited !== "true");
      setShowWishlistBadge(
        cachedWishlistCount > 0 && wishlistVisited !== "true"
      );
    }

    fetchCounts();

    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [userId, isAdmin, fetchCounts, hasMounted]);

  // Clear badges when visiting cart or wishlist pages
  useEffect(() => {
    if (!hasMounted) return;

    if (pathname === "/carts") {
      localStorage.setItem("cartVisited", "true");
      setShowCartBadge(false);
    } else if (pathname === "/wishlist") {
      localStorage.setItem("wishlistVisited", "true");
      setShowWishlistBadge(false);
    }
  }, [pathname, hasMounted]);

  // Listen for storage events across browser tabs & custom updates in-app
  useEffect(() => {
    if (!hasMounted) return;

    const handleStorageChange = () => {
      if (userId && !isAdmin) {
        const cartCount = parseInt(
          localStorage.getItem("cartCount") || "0",
          10
        );
        const wishlistCount = parseInt(
          localStorage.getItem("wishlistCount") || "0",
          10
        );
        const cartVisited = localStorage.getItem("cartVisited");
        const wishlistVisited = localStorage.getItem("wishlistVisited");

        setCartCount(cartCount);
        setWishlistCount(wishlistCount);
        setShowCartBadge(cartCount > 0 && cartVisited !== "true");
        setShowWishlistBadge(
          wishlistCount > 0 && wishlistVisited !== "true"
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("countsUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("countsUpdated", handleStorageChange);
    };
  }, [userId, isAdmin, hasMounted]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-elegant">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group font-cinzel text-lg font-semibold tracking-wide transition-opacity hover:opacity-80 sm:text-xl">
              {general?.siteName || "Alena Collection"}
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Categories */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-background hover:bg-accent">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-2 p-6 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
                      {categories.length > 4 && (
                        <li className="md:col-span-2">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/category"
                              className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:shadow-soft border-2 border-primary/20 hover:border-primary/40 bg-gradient-subtle group"
                            >
                              <div className="text-base font-bold leading-none text-primary group-hover:scale-105 transition-transform inline-block">
                                View All Categories
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                                Explore dresses, co-ord sets, outerwear, and more
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )}

                      {categories.slice(0, 4).map((category) => (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/category/${category.slug}`}
                              className="group block select-none rounded-lg leading-none no-underline outline-none transition-all hover:shadow-soft overflow-hidden border border-border/50 hover:border-primary/30"
                            >
                              <div className="relative h-32 overflow-hidden">
                                <Image
                                  src={category.image ?? "/product_placeholder.jpeg"}
                                  alt={category.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                              </div>
                              <div className="p-3">
                                <div className="text-sm font-semibold leading-none mb-1 group-hover:text-primary transition-colors">
                                  {category.name}
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground line-clamp-1">
                                  {category.description}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Shop */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Shop
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Stories */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-background hover:bg-accent">
                    Style Edit
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-2 p-6 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
                      {stories.map((story) => (
                        <li key={story.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={story.href}
                              className="group block select-none rounded-lg leading-none no-underline outline-none transition-all hover:shadow-soft overflow-hidden border border-border/50 hover:border-primary/30"
                            >
                              <div className="relative h-32 overflow-hidden">
                                <Image
                                  src={story.image}
                                  alt={story.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                              </div>
                              <div className="p-3">
                                <div className="text-sm font-semibold leading-none mb-1 group-hover:text-primary transition-colors">
                                  {story.name}
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground line-clamp-1">
                                  {story.description}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/search">
                <Button
                  variant="ghost"
                  aria-label="Search"
                  size="icon"
                  className="hover:scale-110 hover:text-primary transition-transform"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>

              {hasMounted && !isAdmin && (
                <>
                  <Link href="/wishlist">
                    <Button
                      variant="ghost"
                      aria-label="Wishlist"
                      size="icon"
                      className="relative hover:scale-110 hover:text-primary transition-transform"
                    >
                      <Heart className="w-5 h-5" />
                      {showWishlistBadge && wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                          {wishlistCount > 9 ? "9+" : wishlistCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link href="/carts">
                    <Button
                      variant="ghost"
                      aria-label="Cart"
                      size="icon"
                      className="relative hover:scale-110 hover:text-primary transition-transform group"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {showCartBadge && cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg group-hover:scale-110 transition-transform">
                          {cartCount > 9 ? "9+" : cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </>
              )}

              {/* Auth Controls */}
              {hasMounted && !session ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="ml-2 hover:shadow-soft transition-all"
                  >
                    <Link href="/login">
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="ml-2 hover:shadow-soft transition-all"
                  >
                    <Link href="/register">Signup</Link>
                  </Button>
                </>
              ) : hasMounted && session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-9 h-9 cursor-pointer rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || ""}
                        />
                        <AvatarFallback>
                          {session.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>
                      <p className="font-bold">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        {session.user?.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              aria-label="Toggle navigation menu"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-foreground hover:text-primary transition-all p-2 hover:scale-110"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {isOpen && (
            <div className="lg:hidden py-6 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="text-foreground hover:text-primary transition-colors font-medium py-1"
                  >
                    Home
                  </Link>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Categories
                    </p>
                    <div className="pl-4 space-y-2">
                      {categories.slice(0, 4).map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-foreground hover:text-primary py-1"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      {categories.length > 4 && (
                        <Link
                          href="/category"
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-primary hover:text-primary/80 py-1 font-semibold"
                        >
                          View All Categories
                        </Link>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/products"
                    onClick={() => setIsOpen(false)}
                    className="text-foreground hover:text-primary transition-colors font-medium py-1"
                  >
                    Shop
                  </Link>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Style Edit
                    </p>
                    <div className="pl-4 space-y-2">
                      {stories.map((story) => (
                        <Link
                          key={story.id}
                          href={story.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-foreground hover:text-primary py-1"
                        >
                          {story.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                  <Link href="/search" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" /> Search
                    </Button>
                  </Link>

                  {hasMounted && !isAdmin && (
                    <>
                      <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start relative">
                          <Heart className="w-4 h-4 mr-2" /> Wishlist
                          {showWishlistBadge && wishlistCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                              {wishlistCount > 9 ? "9+" : wishlistCount}
                            </span>
                          )}
                        </Button>
                      </Link>

                      <Link href="/carts" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start relative">
                          <ShoppingBag className="w-4 h-4 mr-2" /> Cart
                          {showCartBadge && cartCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                              {cartCount > 9 ? "9+" : cartCount}
                            </span>
                          )}
                        </Button>
                      </Link>
                    </>
                  )}

                  {hasMounted && !session ? (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild variant="default" className="w-full">
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Signup
                        </Link>
                      </Button>
                    </div>
                  ) : hasMounted && session ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <User className="w-4 h-4 mr-2" /> Profile
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsOpen(false);
                          setShowLogoutDialog(true);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
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