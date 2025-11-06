"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session && (session.user as any)?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: "ADMIN",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      toast.success("Account created successfully!");

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created but login failed. Please login manually.");
        router.push("/admin/login");
        return;
      }

      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
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
            <p className="text-gray-600 dark:text-slate-300 text-center text-sm mb-6">Create your admin account</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="pl-10 h-9 bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="pl-10 h-9 bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    required
                    className="pl-10 h-9 bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    required
                    className="pl-10 pr-12 h-11 bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400"
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    className="pl-10 pr-12 h-11 bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Already an admin?{" "}
                <Link
                  href="/admin/login"
                  className="font-semibold text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                >
                  Sign in
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
