"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { passwordValidation } from "@/app/validations/auth/auth-achema";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    // Validate password with Zod schema
    const validation = passwordValidation.safeParse({ password });
    if (!validation.success) {
      setErrors({ password: validation.error.message });
      return;
    }

    //  Confirm password match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        toast.success(data.message);
        setTimeout(() => router.push("/login"), 2000);
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
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your new password to regain access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <Label className="text-sm font-semibold mb-1">
              New Password <span className="text-destructive">*</span>
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.password;
                  return next;
                });
              }}
              className={`bg-card text-foreground placeholder:text-muted-foreground pr-10 transition-all ${
                errors.password
                  ? "border-destructive border-2 focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-primary"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.75} />
              ) : (
                <Eye size={18} strokeWidth={1.75} />
              )}
            </button>
            <p className="text-xs text-destructive mt-1 h-4">
              {errors.password}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Label className="text-sm font-semibold mb-1">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <Input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.confirmPassword;
                  return next;
                });
              }}
              className={`bg-card text-foreground placeholder:text-muted-foreground pr-10 transition-all ${
                errors.confirmPassword
                  ? "border-destructive border-2 focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-primary"
            >
              {showConfirm ? (
                <EyeOff size={18} strokeWidth={1.75} />
              ) : (
                <Eye size={18} strokeWidth={1.75} />
              )}
            </button>
            <p className="text-xs text-destructive mt-1 h-4">
              {errors.confirmPassword}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-semibold py-3 px-4 rounded transition-all duration-200 mt-6 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : <>Reset Password →</>}
          </button>

          {/* API or Success Message */}
          {errors.api && (
            <p className="text-xs text-destructive mt-1 h-4">{errors.api}</p>
          )}
          {message && (
            <p className="text-xs text-green-500 mt-1 h-4">{message}</p>
          )}
        </form>

        <p className="text-center text-sm text-primary cursor-default">
          Remembered your password?{" "}
          <Link
            href={"/login"}
            className="text-blue-700 hover:text-primary-glow transition-smooth underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
