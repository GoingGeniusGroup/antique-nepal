"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FacebookIcon, X } from "lucide-react";
import GoogleSignin from "../button/goole-sign-in-button";

interface SignupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SignIn = ({ open, onOpenChange }: SignupDialogProps) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res: any = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email/phone or password");
    } else {
      toast.success("Signed in successfully!");
      onOpenChange?.(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md bg-paper border-mountain border-2">
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 text-primary hover:text-terracotta"
        >
          <X className="w-6 h-6" />
        </button>

        <DialogTitle asChild>
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">
              WELCOME BACK
            </h1>
            <p className="text-sm text-gray-600 font-sans">
              Sign in to your account to continue
            </p>
          </div>
        </DialogTitle>

        <div className="mt-8 space-y-3">
          <GoogleSignin />
          <button className="w-full bg-hemp hover:bg-opacity-80 text-primary font-sans font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-primary border-opacity-20">
            <FacebookIcon className="w-5 h-5" />
            Continue with Facebook
          </button>
        </div>

        <div className="relative my-6 text-center text-sm text-gray-500">
          Or continue with email or phone
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Email or phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"} →
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignIn;
