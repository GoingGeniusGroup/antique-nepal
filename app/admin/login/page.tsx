"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session && (session.user as any)?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      const response = await fetch("/api/auth/session");
      const sessionData = await response.json();

      if (sessionData?.user?.role !== "ADMIN") {
        toast.error("Access denied. Admin privileges required.");
        await signIn("credentials", { redirect: false }); // Sign out
        return;
      }

      toast.success("Login successful!");
      router.push("/admin");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-row justify-center items-center gap-2 mb-4"
            >
              {/* Light Mode - Icon then Text */}
              <Image
                src="/logo/Antique-Nepal-Logo-2.png"
                alt="Logo Icon"
                width={70}
                height={70}
                className="object-contain dark:hidden flex-shrink-0"
              />
              <Image
                src="/logo/Antique-Nepal-Logo-3.png"
                alt="Logo Text"
                width={160}
                height={50}
                className="object-contain dark:hidden flex-shrink-0"
              />
              {/* Dark Mode - Icon then Text (same order) */}
              <Image
                src="/logo/Antique-Nepal-Logo-White-Png-3.png"
                alt="Logo Icon"
                width={70}
                height={70}
                className="object-contain hidden dark:block flex-shrink-0"
              />
              <Image
                src="/logo/Antique-Nepal-Logo-White-Png-2.png"
                alt="Logo Text"
                width={160}
                height={50}
                className="object-contain hidden dark:block flex-shrink-0"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 text-center">Admin Portal</h1>
            <p className="text-gray-600 dark:text-slate-300 text-center text-sm mb-6">Sign in to access the dashboard</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="pl-10 h-10 bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pl-10 pr-12 h-10 bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Not an admin?{" "}
                <Link
                  href="/admin/signup"
                  className="font-semibold text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4 text-xs text-gray-500 dark:text-slate-400"
        >
          Admin access only. Unauthorized access is prohibited.
        </motion.p>
      </motion.div>
    </div>
  );
}
