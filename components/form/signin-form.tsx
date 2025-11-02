"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SigninForm: React.FC = () => {
  const route = useRouter();
  const [countryCode, setCountryCode] = useState("+977");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!phone || !password) {
      setError("Please enter both phone number and password");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false, // important for SPA flow
        phone: countryCode + phone,
        password,
      });

      if (result?.error) {
        setError("Invalid phone or password");
      } else {
        route.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {/* <div> */}
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Select
                value={countryCode}
                onValueChange={setCountryCode}
                name="prefix"
              >
                <SelectTrigger className="w-[140px] bg-background border border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+977">Nepal (+977)</SelectItem>
                  <SelectItem value="+1">USA (+1)</SelectItem>
                  <SelectItem value="+91">India (+91)</SelectItem>
                  <SelectItem value="+86">China (+86)</SelectItem>
                  <SelectItem value="+44">UK (+44)</SelectItem>
                  <SelectItem value="+81">Japan (+81)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 border border-border focus:border-primary bg-background"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
                <Link
                  href="#"
                  className="text-sm text-primary hover:text-primary-glow transition-smooth"
                >
                  Forgot password?
                </Link>
              </Label>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-border focus:border-primary bg-background pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-background border border-border text-foreground hover:shadow-md flex items-center justify-center gap-2 font-medium"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button
            type="button"
            className="w-full bg-[#1877F2] text-white hover:bg-[#166FE0] flex items-center justify-center gap-2 font-medium"
          >
            <FaFacebook className="w-5 h-5 text-white" />
            Continue with Facebook
          </Button>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => route.push("/register")}
            className="text-primary font-medium underline hover:text-primary/80"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
