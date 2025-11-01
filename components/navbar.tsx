"use client";

import { useState, useRef, useEffect } from "react";
import { NavigationLink } from "@/components/navigation-link";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { Menu, X, ShoppingBag, BookOpen, Mail, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Featured products for Shop dropdown
const featuredProducts = [
  {
    id: 1,
    name: "Traditional Weave Tote",
    price: "$300",
    image: "/hemp-bag-1%201.png",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Minimalist Hemp Bag",
    price: "$300",
    image: "/hemp-bag-2%201.png",
    tag: "New",
  },
  {
    id: 3,
    name: "Mountain Explorer Pack",
    price: "$300",
    image: "/hemp-bag-3%201.png",
    tag: "Popular",
  },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { theme, isReady } = useTheme();
  const shopDropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  // Close shop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsShopOpen(false);
      }
    };

    if (isShopOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShopOpen]);

  const isDark = isReady && theme === "dark";
  
  // Aceternity UI style - warm beige/cream for light mode, dark for dark mode
  const navBg = isDark 
    ? "bg-black/70 backdrop-blur-xl border-white/10" 
    : "bg-[#f7f5f2]/80 dark:bg-black/70 backdrop-blur-xl border-[#e8e0d8]/50";
  
  const textColor = isDark 
    ? "text-white" 
    : "text-[#2d2520]";
  
  const borderColor = isDark 
    ? "border-white/10" 
    : "border-[#e8e0d8]/50";

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        navBg,
        "border-b",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <NavigationLink href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <span
                className={cn(
                  "text-xl md:text-2xl font-bold tracking-[0.15em] transition-colors",
                  isDark 
                    ? "text-white group-hover:text-amber-300" 
                    : "text-[#2d2520] group-hover:text-primary"
                )}
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                ANTIQUE NEPAL
              </span>
            </motion.div>
          </NavigationLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Shop with Dropdown */}
            <div 
              className="relative"
              ref={shopDropdownRef}
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <NavigationLink
                href="/products"
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-inter font-medium transition-all duration-200 flex items-center gap-2 relative group",
                  isDark 
                    ? "text-white/90 hover:text-white hover:bg-white/10" 
                    : "text-[#2d2520]/90 hover:text-[#2d2520] hover:bg-[#e8e0d8]/30"
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                Shop
                <ChevronDown 
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isShopOpen ? "rotate-180" : ""
                  )} 
                />
              </NavigationLink>

              {/* Shop Dropdown */}
              <AnimatePresence>
                {isShopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                      "absolute top-full left-0 mt-2 w-[600px] rounded-2xl shadow-2xl overflow-hidden",
                      isDark 
                        ? "bg-black/95 backdrop-blur-xl border border-white/10" 
                        : "bg-white/95 backdrop-blur-xl border border-[#e8e0d8]/50"
                    )}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={cn(
                          "font-semibold text-base",
                          isDark ? "text-white" : "text-[#2d2520]"
                        )}>
                          Featured Products
                        </h3>
                        <NavigationLink 
                          href="/products"
                          onClick={() => setIsShopOpen(false)}
                          className={cn(
                            "text-sm font-medium hover:underline transition-all",
                            isDark ? "text-amber-300" : "text-primary"
                          )}
                        >
                          View All →
                        </NavigationLink>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {featuredProducts.map((product) => (
                          <NavigationLink
                            key={product.id}
                            href="/products"
                            onClick={() => setIsShopOpen(false)}
                            className="group"
                          >
                            <motion.div
                              whileHover={{ y: -4, scale: 1.02 }}
                              className={cn(
                                "rounded-xl overflow-hidden transition-all duration-300",
                                isDark 
                                  ? "bg-white/5 hover:bg-white/10 border border-white/10" 
                                  : "bg-[#f7f5f2] hover:bg-[#e8e0d8] border border-[#e8e0d8]"
                              )}
                            >
                              <div className="relative h-32 w-full overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-3">
                                <p className={cn(
                                  "text-xs font-medium mb-1 truncate",
                                  isDark ? "text-white/90" : "text-[#2d2520]"
                                )}>
                                  {product.name}
                                </p>
                                <p className={cn(
                                  "text-sm font-bold",
                                  isDark ? "text-amber-300" : "text-primary"
                                )}>
                                  {product.price}
                                </p>
                              </div>
                            </motion.div>
                          </NavigationLink>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Nav Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavigationLink
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-inter font-medium transition-all duration-200 flex items-center gap-2",
                    isDark 
                      ? "text-white/90 hover:text-white hover:bg-white/10" 
                      : "text-[#2d2520]/90 hover:text-[#2d2520] hover:bg-[#e8e0d8]/30"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </NavigationLink>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <NavigationLink href="/login">
              <Button
                variant="outline"
                className={cn(
                  "font-inter transition-all",
                  isDark 
                    ? "border-white/30 bg-transparent text-white hover:bg-white/20 hover:text-white hover:border-white/50"
                    : "border-[#d4c5b0] bg-transparent text-[#2d2520] hover:bg-[#e8e0d8] hover:text-[#2d2520] hover:border-[#c9b7a0]"
                )}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </NavigationLink>
            <NavigationLink href="/register">
              <Button className="font-inter bg-primary hover:bg-primary/90 text-primary-foreground transition-all border-0">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </NavigationLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isDark 
                ? "text-white hover:bg-white/10" 
                : "text-[#2d2520] hover:bg-[#e8e0d8]/30"
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("md:hidden overflow-hidden border-t", borderColor)}
            >
              <div className="py-4 space-y-2">
                <NavigationLink
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-inter font-medium transition-all",
                    isDark 
                      ? "text-white/90 hover:text-white hover:bg-white/10" 
                      : "text-[#2d2520]/90 hover:text-[#2d2520] hover:bg-[#e8e0d8]/30"
                  )}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Shop</span>
                </NavigationLink>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavigationLink
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-inter font-medium transition-all",
                        isDark 
                          ? "text-white/90 hover:text-white hover:bg-white/10" 
                          : "text-[#2d2520]/90 hover:text-[#2d2520] hover:bg-[#e8e0d8]/30"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </NavigationLink>
                  );
                })}
                <div className={cn("pt-4 border-t space-y-2", borderColor)}>
                  <NavigationLink href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full font-inter justify-start",
                        isDark 
                          ? "border-white/30 bg-transparent text-white hover:bg-white/20 hover:text-white hover:border-white/50"
                          : "border-[#d4c5b0] bg-transparent text-[#2d2520] hover:bg-[#e8e0d8] hover:text-[#2d2520] hover:border-[#c9b7a0]"
                      )}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </NavigationLink>
                  <NavigationLink href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full font-inter bg-primary hover:bg-primary/90 text-primary-foreground justify-start border-0">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </NavigationLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
