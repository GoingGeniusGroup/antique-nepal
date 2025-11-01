"use client";

import type React from "react";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FacebookIcon, X } from "lucide-react";

import GoogleSignin from "../button/goole-sign-in-button";
import { registerUser } from "@/app/actions/auth/register";
import toast from "react-hot-toast";

interface SignupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Signup = ({ open, onOpenChange }: SignupDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const result = await registerUser(form);

    setLoading(false);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } else {
      toast.success(result.message ?? "Account created successfully");
      onOpenChange?.(false);
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
                CREATE AN ACCOUNT
              </h1>
              <p className="text-sm text-muted-foreground font-sans">
                Get started with your free account
              </p>
            </div>
          </DialogTitle>

          <div className="mt-8 space-y-3">
            {/* OAuth Buttons */}
            <GoogleSignin />
            <button className="w-full bg-[hsl(var(--hemp))] hover:bg-[hsl(var(--hemp-dark))] text-primary font-sans font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary border-opacity-20">
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-sans font-semibold text-primary mb-1">
                  First Name
                </label>
                <Input
                  name="firstName"
                  type="text"
                  placeholder=""
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`bg-white transition-all ${
                    errors.firstName
                      ? "border-[hsl(var(--terracotta))] border-2 focus:border-[hsl(var(--terracotta))]"
                      : "border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain))]"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-[hsl(var(--terracotta))] mt-1 h-4">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-sans font-semibold text-primary mb-1">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  type="text"
                  placeholder=""
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`bg-white transition-all ${
                    errors.lastName
                      ? "border-[hsl(var(--terracotta))] border-2 focus:border-[hsl(var(--terracotta))]"
                      : "border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain))]"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-[hsl(var(--terracotta))] mt-1 h-4">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-sans font-semibold text-primary mb-1">
                Phone
              </label>
              <Input
                name="phone"
                type="tel"
                placeholder=""
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`bg-white transition-all ${
                  errors.phone
                    ? "border-[hsl(var(--terracotta))] border-2 focus:border-[hsl(var(--terracotta))]"
                    : "border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain))]"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-[hsl(var(--terracotta))] mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-sans font-semibold text-primary mb-1 h-4">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder=""
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`bg-white transition-all ${
                  errors.email
                    ? "border-[hsl(var(--terracotta))] border-2 focus:border-[hsl(var(--terracotta))]"
                    : "border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain))]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-[hsl(var(--terracotta))] mt-1 h-4">
                  {errors.email}
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
                value={formData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`bg-white transition-all ${
                  errors.password
                    ? "border-[hsl(var(--terracotta))] border-2 focus:border-[hsl(var(--terracotta))]"
                    : "border-[hsl(var(--mountain-light))] focus:border-[hsl(var(--mountain))]"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-[hsl(var(--terracotta))] mt-1 h-4">
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
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Create account <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm font-sans text-muted-foreground">
              Already have an account?{" "}
              <button className="text-[hsl(var(--mountain))] font-semibold hover:text-[hsl(var(--terracotta))] transition-colors duration-200">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Signup;

export { Signup as SignupD };
