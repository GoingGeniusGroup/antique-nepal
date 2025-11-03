"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Label } from "../ui/label";
import GoogleSigninButton from "../button/google-sign-in-button";
import FacebookSigninButton from "../button/facebook-sign-in-button";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    if (!email || !password) {
      const newErrors: Record<string, string> = {};
      if (!email) newErrors.identifier = "Email is required";
      if (!password) newErrors.password = "Password is required";
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const res: any = await signIn("credentials", {
      redirect: false,
      email,
      password,
    } as any);

    setLoading(false);

    if (res?.error) {
      // Show toast only
      let message = String(res.error);

      if (message === "CredentialsSignin" || /invalid/i.test(message)) {
        message = "Invalid email or password";
      } else if (/both fields/i.test(message)) {
        message = "Both email and password are required";
      }

      toast.error(message);

      // Do NOT set errors on the input fields
    } else {
      setErrors({});
      toast.success("Signed in successfully");
      setTimeout(() => {
        router.push("/auth-buttons");
      }, 500);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      {/* <div> */}
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-cinzel font-bold text-primary mb-2">
            welcome back
          </h1>
          <p className="text-sm text-muted-foreground font-sans">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-sans font-semibold text-primary mb-1">
              Email
            </label>
            <Input
              name="email"
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.identifier;
                  return next;
                });
              }}
              className={`bg-white transition-all${
                errors.identifier
                  ? "border-[hsl(var(--terracotta))] border-2 focus:border-[hsl(var(--terracotta) hover:border-[hsl(var(--terracotta))]"
                  : "border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain) hover:border-[hsl(var(--mountain-dark))]"
              }`}
            />
            <p className="text-xs text-[hsl(var(--terracotta))] mt-1 h-4">
              {errors.identifier || ""}
            </p>
          </div>

          {/* Password */}
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Link
                href="#"
                className="text-sm text-blue-700 hover:text-primary-glow transition-smooth "
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-border focus:border-primary bg-white pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-[hsl(var(--earth))] text-[hsl(var(--paper))] font-sans font-semibold py-3 px-4 rounded transition-all duration-200 mt-6 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <span className="grow h-px bg-gray-300 dark:bg-gray-600"></span>
          <span className="px-3 text-primary dark:text-primary-foreground uppercase text-xs">
            OR
          </span>
          <span className="grow h-px bg-gray-300 dark:bg-gray-600"></span>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <GoogleSigninButton />
          <FacebookSigninButton />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-primary cursor-default">
          Don't have an account?{" "}
          <Link
            type="button"
            href={"/register"}
            className="text-blue-700 hover:text-primary-glow transition-smooth underline cursor-pointer"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
