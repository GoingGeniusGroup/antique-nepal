import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/theme-context";
import { ClientRoot } from "../components/client-root";
import { auth } from "@/lib/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider session={session}>
          <ThemeProvider>
            <ClientRoot>{children}</ClientRoot>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
