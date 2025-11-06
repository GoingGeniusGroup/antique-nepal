import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/theme-context";
import { SettingsProvider } from "@/contexts/settings-context";
import Script from "next/script";
import { ClientRoot } from "../components/client-root";
import { auth } from "@/lib/auth";
import { ThemeAwareTopLoader } from "@/components/theme-aware-toploader";
import { AuthSuccessHandler } from "@/components/auth-success-handler";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional — choose what you need
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400"], // optional — choose what you need
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var saved = localStorage.getItem('theme');
                var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var isDark = saved ? saved === 'dark' : prefersDark;
                var root = document.documentElement;
                if (isDark) root.classList.add('dark'); else root.classList.remove('dark');
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider session={session}>
          <ThemeProvider>
            <SettingsProvider>
              <ThemeAwareTopLoader />
              <AuthSuccessHandler />
              <ClientRoot>{children}</ClientRoot>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  className: "",
                  style: {
                    background: "hsl(var(--card))",
                    color: "hsl(var(--card-foreground))",
                    border: "2px solid hsl(var(--border))",
                    padding: "16px 20px",
                    fontSize: "15px",
                    fontWeight: "500",
                    borderRadius: "12px",
                    boxShadow:
                      "0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)",
                    maxWidth: "400px",
                  },
                  success: {
                    duration: 2500,
                    style: {
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                      border: "2px solid rgb(34, 197, 94)",
                      boxShadow:
                        "0 10px 40px rgba(34, 197, 94, 0.3), 0 0 30px rgba(34, 197, 94, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
                      animation: "toast-glow-success 2s ease-in-out infinite",
                    },
                    iconTheme: {
                      primary: "rgb(34, 197, 94)",
                      secondary: "hsl(var(--card))",
                    },
                  },
                  error: {
                    duration: 3000,
                    style: {
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                      border: "2px solid rgb(239, 68, 68)",
                      boxShadow:
                        "0 10px 40px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
                      animation: "toast-glow-error 2s ease-in-out infinite",
                    },
                    iconTheme: {
                      primary: "rgb(239, 68, 68)",
                      secondary: "hsl(var(--card))",
                    },
                  },
                  loading: {
                    style: {
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                      border: "2px solid rgb(59, 130, 246)",
                      boxShadow:
                        "0 10px 40px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                    iconTheme: {
                      primary: "rgb(59, 130, 246)",
                      secondary: "hsl(var(--card))",
                    },
                  },
                }}
                containerStyle={{
                  bottom: 40,
                  right: 40,
                }}
              />
            </SettingsProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
