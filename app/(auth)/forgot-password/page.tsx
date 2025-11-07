"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
      } else {
        setErrors({ api: data.error || "Something went wrong" });
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      setErrors({ api: "Network error or server is unreachable" });
      toast.error("Network error or server is unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6 sm:py-8 text-foreground dark:text-foreground">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6">
        <div className="text-2xl sm:text-3xl text-primary font-bold mb-6">
          <h1 className="text-4xl font-cinzel font-bold text-primary mb-2">
            Forgot Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your email to receive a password reset link.
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-semibold py-3 px-4 rounded transition-all duration-200 mt-6 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Send Reset Link <span>→</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-primary cursor-default">
          Remember your password?{" "}
          <Link
            type="button"
            href={"/login"}
            className="text-blue-700 hover:text-primary-glow transition-smooth underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
