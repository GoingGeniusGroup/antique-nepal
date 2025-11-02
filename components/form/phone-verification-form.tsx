"use client";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

import toast from "react-hot-toast";

import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import GoogleSigninButton from "../button/goole-sign-in-button";
import FacebookSigninButton from "../button/facebook-sign-in-button";

interface PhoneVerificationFormProps {
  onVerified: (data: { prefix: string; phone: string }) => void;
}

const PhoneVerificationForm: React.FC<PhoneVerificationFormProps> = ({
  onVerified,
}) => {
  const route = useRouter();
  const [countryCode, setCountryCode] = useState("+977");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Make a div for reCAPTCHA in invisible mode
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified"),
        }
      );
    }
  }, []);

  const handleGetVerificationCode = async () => {
    if (!phone) return toast.error("Please enter your phone number");
    setIsLoading(true);

    const fullNumber = countryCode + phone;
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      toast.success("Verification code sent successfully!");
      setCodeSent(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms)
      return toast.error("Please agree to Terms & Conditions");
    if (!verificationCode) return toast.error("Enter the verification code");

    setIsLoading(true);
    try {
      await window.confirmationResult.confirm(verificationCode);
      toast.success("Phone verified successfully!");
      onVerified({ prefix: countryCode, phone });
    } catch (err: any) {
      console.error(err);
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            CREATE AN ACCOUNT
          </h1>
          <p className="text-sm text-muted-foreground">
            Get started with your free account
          </p>
        </div>

        {/*error*/}
        <div className="text-sm text-destructive animate-in fade-in slide-in-from-top-2 h-4">
          {error}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div id="recaptcha-container" />
          <div className="space-y-4">
            {/* Phone Number */}
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
                  name="phone"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="flex-1 bg-white border border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Verification Code */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Verification Code <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  type="text"
                  name="code"
                  placeholder="Enter code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="flex-1 bg-white border border-border focus:border-primary transition-colors"
                />
                <Button
                  type="button"
                  onClick={handleGetVerificationCode}
                  variant="outline"
                  className="whitespace-nowrap border border-primary text-foreground hover:bg-muted hover:text-muted-foreground"
                >
                  {codeSent ? "Resend Code" : "Get Code"}
                </Button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={() => setAgreedToTerms(true)}
              />
              <label
                htmlFor="terms"
                className="text-xs text-muted leading-none"
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => window.open("/terms", "_blank")}
                  className="text-primary font-medium underline"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-medium transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>

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
            {/* Google Button */}
            <GoogleSigninButton />

            {/* Facebook Button */}
            <FacebookSigninButton />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted cursor-default">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => route.push("/login")}
              className="text-primary font-medium underline hover:text-primary/80 cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PhoneVerificationForm;
