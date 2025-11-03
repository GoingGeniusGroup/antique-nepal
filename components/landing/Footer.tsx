"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import footerData from "@/data/footer.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const iconMap: Record<string, any> = {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
};

export const Footer = () => {
  const { brand, social, sections, contact, newsletter, copyright } =
    footerData;

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="container px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold font-cinzel tracking-tight text-foreground">
                  {brand.name}
                </span>
                <p className="text-sm text-muted-foreground font-inter mt-1">
                  {brand.tagline}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-md font-inter">
              {brand.description}
            </p>
            <div className="flex gap-3 pt-2">
              <TooltipProvider>
                {social.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                          aria-label={item.name}
                        >
                          {Icon ? (
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground" />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              ?
                            </span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 font-cinzel">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-inter font-medium hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Newsletter Section */}
        <div className="grid lg:grid-cols-2 gap-12 mt-16 pt-16 border-t border-border">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold font-cinzel text-foreground">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors duration-200 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground font-inter">
                    Our Office
                  </p>
                  <p className="text-sm text-muted-foreground font-inter mt-1">
                    {contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors duration-200 flex-shrink-0">
                  <Phone className="w-4 h-4 text-muted-foreground group-hover:text-secondary-foreground" />
                </div>
                <div>
                  <Link
                    href={`tel:${contact.phone}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors font-inter"
                  >
                    {contact.phone}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors duration-200 flex-shrink-0">
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground" />
                </div>
                <div>
                  <Link
                    href={`mailto:${contact.email}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors font-inter"
                  >
                    {contact.email}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold font-cinzel text-foreground mb-3">
                {newsletter.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-inter">
                {newsletter.description}
              </p>
            </div>
            <div className="flex gap-3 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary font-inter"
              />
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 flex items-center gap-2 transition-all duration-200 hover:scale-105 font-inter"
                size="sm"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-inter">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-inter">
              © {copyright.year} {brand.name}. {copyright.text}
            </p>
            <div className="flex gap-6">
              {sections
                .find((s) => s.title === "Legal")
                ?.links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-inter"
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
