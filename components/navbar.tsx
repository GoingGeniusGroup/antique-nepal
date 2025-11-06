"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { stories } = navigationData;
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

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
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 hover:text-primary transition-transform"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-110 hover:text-primary transition-transform"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/carts">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:scale-110 hover:text-primary transition-transform group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                    0
                  </span>
                </Button>
              </Link>

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
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 hover:shadow-soft transition-all"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  <Link href="/profile">
                    <Avatar className="w-8 h-8 cursor-pointer">
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
                  </Link>
                </>
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
                  <Link href="/wishlist">
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="w-4 h-4 mr-2" /> Wishlist
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="w-4 h-4 mr-2" /> Cart (0)
                  </Button>
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
          await signOut({ redirect: false });
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
