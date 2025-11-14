"use client";

import { useEffect, useState } from "react";
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

import { useTheme } from "@/contexts/theme-context";
import navigationData from "@/data/navigation.json";
import { signOut, useSession } from "next-auth/react";
import logoImgDark from "@/public/logo/Antique-Nepal-Logo-2.png";
import logoTextImgDark from "@/public/logo/Antique-Nepal-Logo-3.png";
import toast from "react-hot-toast";
import logoTextImgWhite from "@/public/logo/Antique-Nepal-Logo-White-Png-2.png";
import logoImgWhite from "@/public/logo/Antique-Nepal-Logo-White-Png-3.png";
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

export const Navbar = () => {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { stories } = navigationData;
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";
  const pathname = usePathname();
  const userId = session?.user?.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showCartBadge, setShowCartBadge] = useState(false);
  const [showWishlistBadge, setShowWishlistBadge] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Fetch cart and wishlist counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!userId || isAdmin) {
        // Clear counts if no user or admin
        setCartCount(0);
        setWishlistCount(0);
        setShowCartBadge(false);
        setShowWishlistBadge(false);
        return;
      }

      try {
        // Fetch cart count
        const cartRes = await fetch(`/api/cart`);
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          const count = cartData?.cart?.items?.length || 0;
          setCartCount(count);
          localStorage.setItem("cartCount", count.toString());

          // Show badge if there are items and user hasn't visited
          const cartVisited = localStorage.getItem("cartVisited");
          setShowCartBadge(count > 0 && cartVisited !== "true");
        }

        // Fetch wishlist count
        const wishlistRes = await fetch(`/api/wishlist?userId=${userId}`);
        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          const count = wishlistData?.items?.length || 0;
          setWishlistCount(count);
          localStorage.setItem("wishlistCount", count.toString());

          // Show badge if there are items and user hasn't visited
          const wishlistVisited = localStorage.getItem("wishlistVisited");
          setShowWishlistBadge(count > 0 && wishlistVisited !== "true");
        }
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      }
    };

    // Only load from cache if user is logged in
    if (userId && !isAdmin) {
      // Load counts from localStorage immediately for instant display
      const cachedCartCount = parseInt(
        localStorage.getItem("cartCount") || "0"
      );
      const cachedWishlistCount = parseInt(
        localStorage.getItem("wishlistCount") || "0"
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

    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [userId, isAdmin]);

  // Clear badges when visiting cart or wishlist pages
  useEffect(() => {
    if (pathname === "/carts") {
      localStorage.setItem("cartVisited", "true");
      setShowCartBadge(false);
    } else if (pathname === "/wishlist") {
      localStorage.setItem("wishlistVisited", "true");
      setShowWishlistBadge(false);
    }
  }, [pathname]);

  // Listen for storage events for instant updates
  useEffect(() => {
    const handleStorageChange = () => {
      if (userId && !isAdmin) {
        // Instantly read updated counts from localStorage
        const cartCount = parseInt(localStorage.getItem("cartCount") || "0");
        const wishlistCount = parseInt(
          localStorage.getItem("wishlistCount") || "0"
        );
        const cartVisited = localStorage.getItem("cartVisited");
        const wishlistVisited = localStorage.getItem("wishlistVisited");

        setCartCount(cartCount);
        setWishlistCount(wishlistCount);
        setShowCartBadge(cartCount > 0 && cartVisited !== "true");
        setShowWishlistBadge(wishlistCount > 0 && wishlistVisited !== "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userId, isAdmin]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-elegant">
        <div className="container px-4">
          <div className="flex items-center justify-between h-20">
            {/* ✅ Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo Icon */}
              <div className="relative w-8 h-8">
                <Image
                  src={isDark ? logoImgWhite : logoImgDark}
                  alt="Brand Logo"
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-110"
                />
              </div>

              {/* Brand Name */}
              <div className="relative w-32 h-8">
                <Image
                  src={isDark ? logoTextImgWhite : logoTextImgDark}
                  alt="Brand Name"
                  fill
                  className="object-contain transition-colors duration-300 group-hover:opacity-80"
                />
              </div>
            </Link>

            {/* ✅ Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
                              Explore our complete collection of handcrafted
                              bags
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {categories.map((category) => (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/category/${category.slug}`}
                              className="group block select-none rounded-lg leading-none no-underline outline-none transition-all hover:shadow-soft overflow-hidden border border-border/50 hover:border-primary/30"
                            >
                              <div className="relative h-32 overflow-hidden">
                                <div className="relative h-80 overflow-hidden">
                                  <Image
                                    src={category.image ?? "/hemp-bag-1.jpg"}
                                    alt={category.name}
                                    fill // fill the parent div
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-linear-to-t from-background/90 to-transparent" />
                              </div>
                              <div className="p-3">
                                <div className="text-sm font-semibold leading-none mb-1 group-hover:text-primary transition-colors">
                                  {category.name}
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground">
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
                    Stories
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
                                <div className="absolute inset-0 bg-linear-to-t from-background/90 to-transparent" />
                              </div>
                              <div className="p-3">
                                <div className="text-sm font-semibold leading-none mb-1 group-hover:text-primary transition-colors">
                                  {story.name}
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground">
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

            {/* ✅ Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href={"/search"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-110 hover:text-primary transition-transform"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              {!isAdmin && (
                <>
                  <Link href="/wishlist">
                    <Button
                      variant="ghost"
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

              {/*  Auth Buttons*/}
              {!session || (session.user as any)?.role === "ADMIN" ? (
                <>
                  <Link href={"/login"}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 hover:shadow-soft transition-all"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href={"/register"}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 hover:shadow-soft transition-all"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Signup
                    </Button>
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-9 h-9 cursor-pointer">
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
              )}
            </div>

            {/* ✅ Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-foreground hover:text-primary transition-all p-2 hover:scale-110"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* ✅ Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden py-6 animate-fade-in border-t border-border/50">
              <div className="flex flex-col gap-6">
                {/* Links */}
                <div className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  >
                    Home
                  </Link>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Categories
                    </p>
                    <div className="pl-4 space-y-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          className="block text-sm text-foreground hover:text-primary py-1"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/products"
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  >
                    Shop
                  </Link>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Stories
                    </p>
                    <div className="pl-4 space-y-2">
                      {stories.map((story) => (
                        <Link
                          key={story.id}
                          href={story.href}
                          className="block text-sm text-foreground hover:text-primary py-1"
                        >
                          {story.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" /> Search
                  </Button>
                  {!isAdmin && (
                    <>
                      <Link href="/wishlist">
                        <Button
                          variant="outline"
                          className="w-full justify-start relative"
                        >
                          <Heart className="w-4 h-4 mr-2" /> Wishlist
                          {showWishlistBadge && wishlistCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                              {wishlistCount > 9 ? "9+" : wishlistCount}
                            </span>
                          )}
                        </Button>
                      </Link>
                      <Link href="/carts">
                        <Button
                          variant="outline"
                          className="w-full justify-start relative"
                        >
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
                  <Button variant="default" className="w-full mt-2">
                    <User className="w-4 h-4 mr-2" /> Login
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={async () => {
          // Clear cart and wishlist data from localStorage
          localStorage.removeItem("cartCount");
          localStorage.removeItem("wishlistCount");
          localStorage.removeItem("cartVisited");
          localStorage.removeItem("wishlistVisited");

          // Reset badge states
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
