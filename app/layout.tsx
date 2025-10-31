import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { ClientRoot } from "../components/client-root";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional — choose what you need
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional — choose what you need
});

export const metadata: Metadata = {
  title: "Antique Nepal",
  description: "Handcrafted Hemp Bags Woven with Himalayan Heritage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <ClientRoot>{children}</ClientRoot>
        </ThemeProvider>
      </body>
    </html>
  );
}
