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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import FacebookSigninButton from "../button/facebook-sign-in-button";
import GoogleSigninButton from "../button/goole-sign-in-button";

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
        redirect: false,
        phone: countryCode + phone,
        password,
      });

      if (result?.error) {
        setError("Invalid phone or password");
      } else {
        // Login successful, redirect
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
    <div className="flex justify-center items-center p-4">
      {/* <div> */}
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className="text-4xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Error */}

        <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-2 h-4">
          {error}
        </p>

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
                <SelectTrigger className="w-[140px] bg-white border border-border">
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
                className="flex-1 border border-border focus:border-primary bg-white"
              />
            </div>
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
        <p className="text-center text-sm text-muted cursor-default">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => route.push("/register")}
            className="text-secondary font-medium underline hover:text-primary/80 cursor-pointer"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
