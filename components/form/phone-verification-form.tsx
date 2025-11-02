"use client";
import { useState } from "react";
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

interface PhoneVerificationFormProps {
  onVerified: () => void;
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

  const handleGetVerificationCode = () => {
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    setCodeSent(true);
    setError("");
    console.log("Verification code sent to:", countryCode + phone);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onVerified();
    }, 1000);
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-card-foreground p-8  transition-colors">
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

      <form onSubmit={handleSubmit} className="space-y-5">
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
                name="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="flex-1 bg-background border border-border focus:border-primary transition-colors"
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
                className="flex-1 bg-background border border-border focus:border-primary transition-colors"
              />
              <Button
                type="button"
                onClick={handleGetVerificationCode}
                variant="outline"
                className="whitespace-nowrap border border-border text-foreground hover:bg-muted"
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
              onCheckedChange={(checked) => setAgreedToTerms(true)}
            />
            <label
              htmlFor="terms"
              className="text-xs text-muted-foreground leading-none"
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

          {error && (
            <div className="text-sm text-destructive animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-background border border-border text-foreground hover:shadow-md transition-all flex items-center justify-center gap-2 font-medium"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          {/* Facebook Button */}
          <Button
            type="button"
            className="w-full bg-[#1877F2] text-white hover:bg-[#166FE0] flex items-center justify-center gap-2 font-medium transition-all"
          >
            <FaFacebook className="w-5 h-5 text-white" />
            Continue with Facebook
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => route.push("/login")}
            className="text-primary font-medium underline hover:text-primary/80"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};

export default PhoneVerificationForm;
