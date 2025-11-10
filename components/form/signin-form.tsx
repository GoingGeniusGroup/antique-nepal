"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Label } from "../ui/label";
import GoogleSigninButton from "../button/google-sign-in-button";
import FacebookSigninButton from "../button/facebook-sign-in-button";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    if (!email || !password) {
      const newErrors: Record<string, string> = {};
      if (!email) newErrors.email = "Email is required";
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
      let message = String(res.error);
      if (message === "Configuration") {
        message = "Email not verified. Please check your inbox.";
      } else if (message === "CredentialsSignin" || /invalid/i.test(message)) {
        message = "Invalid email or password";
      } else if (/both fields/i.test(message)) {
        message = "Both email and password are required";
      }
      toast.error(message);
    } else {
      setErrors({});
      toast.success(res.message ?? "Logged in successfully");
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6 sm:py-8 text-foreground  dark:text-foreground">
      {/* <div> */}
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col justify-center items-center text-2xl sm:text-3xl text-primary font-bold mb-6">
          <h1 className="text-4xl font-cinzel font-bold text-primary mb-2">
            welcome back
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-semibold mb-1">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.email;
                  return next;
                });
              }}
              className={`bg-card text-foreground placeholder:text-muted-foreground transition-all ${
                errors.email
                  ? "border-destructive border-2 focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            <p className="text-xs text-destructive mt-1 h-4">{errors.email}</p>
          </div>

          {/* Password */}
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold mb-1">
                Password <span className="text-destructive">*</span>
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-700 hover:text-primary-glow transition-smooth "
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.password;
                  return next;
                });
              }}
              className={`w-full pr-10 bg-card text-foreground placeholder:text-muted-foreground transition-all ${
                errors.password
                  ? "border-destructive border-2 focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <p className="text-xs text-destructive mt-1 h-4">
              {errors.password}{" "}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-semibold py-3 px-4 rounded transition-all duration-200 mt-6 flex items-center justify-center gap-2 ${
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

        {/* OR divider */}
        <div className="flex items-center my-6">
          <span className="grow h-px bg-border"></span>
          <span className="px-3 text-muted-foreground uppercase text-xs">
            OR
          </span>
          <span className="grow h-px bg-border"></span>
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

export default SigninForm;
