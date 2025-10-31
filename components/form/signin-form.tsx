"use client";

import React from "react";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-md bg-paper border-mountain border-2"
      >
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 text-primary hover:text-terracotta transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="pt-6 pb-6">
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
            {/* OAuth Buttons */}
            <GoogleSignin />
            <button className="w-full bg-hemp hover:bg-opacity-80 text-primary font-sans font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary border-opacity-20">
              <FacebookIcon className="w-5 h-5" />
              Continue with Facebook
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-paper text-gray-500 font-sans">
                Or continue with email or phone
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-semibold text-primary mb-1">
                Email or phone
              </label>
              <Input
                type="email"
                placeholder=""
                className="border-mountain border-opacity-30 focus:border-mountain bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-semibold text-primary mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder=""
                className="border-mountain border-opacity-30 focus:border-mountain bg-white"
              />
              {/* {errors.password && (
                <p className="text-xs text-terracotta mt-1">
                  {errors.password}
                </p>
              )} */}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-opacity-90 text-white font-sans font-semibold py-3 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
            >
              Sign in
              <span>→</span>
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm font-sans text-gray-600">
              Don't have an account?{" "}
              <button className="text-mountain font-semibold hover:text-terracotta transition-colors">
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
