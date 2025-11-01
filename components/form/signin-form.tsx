"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FacebookIcon, X } from "lucide-react";
import GoogleSignin from "../button/goole-sign-in-button";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface SigninDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SignIn = ({ open, onOpenChange }: SigninDialogProps) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleFacebookSignIn = async () => {
    try {
      await signIn("facebook", { callbackUrl: "/" });
    } catch (error) {
      console.error("Facebook Sign-in failed:", error);
      toast.error("Facebook sign-in failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!identifier.trim() || !password) {
      const newErrors: Record<string, string> = {};
      if (!identifier.trim())
        newErrors.identifier = "Email or phone is required";
      if (!password) newErrors.password = "Password is required";
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const res: any = await signIn("credentials", {
      redirect: false,
      identifier: identifier.trim(),
      password,
    } as any);

    setLoading(false);

    if (res?.error) {
      const raw = String(res.error);
      let friendly = raw;

      if (raw === "CredentialsSignin" || /invalid/i.test(raw)) {
        friendly = "Invalid email/phone or password";
        setErrors({ identifier: friendly, password: friendly });
      } else if (/both fields/i.test(raw)) {
        friendly = "Both email/phone and password are required";
        setErrors({
          identifier: "Email or phone is required",
          password: "Password is required",
        });
      } else {
        setErrors({ identifier: raw });
      }

      toast.error(friendly);
    } else {
      setErrors({});
      toast.success("Signed in successfully");
      onOpenChange?.(false);

      setTimeout(() => {
        router.refresh();
      }, 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md bg-[hsl(var(--paper))] border-[hsl(var(--mountain-light))] border-2 rounded-lg shadow-lg">
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 text-primary hover:text-[hsl(var(--terracotta))] transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="pt-6 pb-6">
          <DialogTitle asChild>
            <div className="text-center">
              <h1 className="text-3xl font-cinzel font-bold text-primary mb-2">
                WELCOME BACK
              </h1>
              <p className="text-sm text-muted-foreground font-sans">
                Sign in to your account to continue
              </p>
            </div>
          </DialogTitle>

          <div className="mt-8 space-y-3">
            <GoogleSignin />
            <button
              onClick={handleFacebookSignIn}
              type="button"
              className="w-full bg-[hsl(var(--hemp))] hover:bg-[hsl(var(--hemp-dark))] text-primary font-sans font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary border-opacity-20"
            >
              <FacebookIcon className="w-5 h-5" />
              Continue with Facebook
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(var(--mountain-light))]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[hsl(var(--paper))] text-muted-foreground font-sans">
                Or continue with email or phone
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-semibold text-primary mb-1">
                Email or phone
              </label>
              <Input
                name="identifier"
                type="text"
                placeholder=""
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.identifier;
                    return next;
                  });
                }}
                className="border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain))] bg-white"
              />
              {errors.identifier && (
                <p className="text-xs text-[hsl(var(--terracotta))] mt-1">
                  {errors.identifier}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-sans font-semibold text-primary mb-1">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.password;
                    return next;
                  });
                }}
                className="border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain))] bg-white"
              />
              {errors.password && (
                <p className="text-xs text-[hsl(var(--terracotta))] mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary hover:bg-[hsl(var(--earth))] text-[hsl(var(--paper))] font-sans font-semibold py-3 px-4 rounded transition-all duration-200 mt-6 flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"} <span>→</span>
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm font-sans text-muted-foreground">
              Don't have an account?{" "}
              <button
                className="text-[hsl(var(--mountain))] font-semibold hover:text-[hsl(var(--terracotta))] transition-colors duration-200"
                onClick={() => {}}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignIn;
