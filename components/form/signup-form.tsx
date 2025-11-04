"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/app/actions/auth/register";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleSigninButton from "../button/google-sign-in-button";
import FacebookSigninButton from "../button/facebook-sign-in-button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "",
    phone: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const form = new FormData(e.currentTarget);
      // Ensure countryCode is sent as prefix
      form.set("countryCode", formData.countryCode);

      const result = await registerUser(form);

      setLoading(false);

      if (!result.success) {
        // If server returns field-specific validation errors from Zod
        if (result.errors) {
          setErrors(result.errors);
        } else {
          // General error (e.g., email already exists)
          toast.error(result.message || "Something went wrong");
        }
      } else {
        setErrors({});
        toast.success(result.message ?? "Account created successfully");
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 500);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6 sm:py-8 text-foreground  dark:text-foreground">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl text-primary font-cinzel font-bold mb-2">
            CREATE AN ACCOUNT
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Get started with your free account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field}>
                <Label className="block text-sm font-semibold mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  name={field}
                  type="text"
                  placeholder={field === "firstName" ? "John" : "Doe"}
                  value={formData[field as keyof typeof formData] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={`bg-card text-foreground placeholder:text-muted-foreground transition-all ${
                    errors[field]
                      ? "border-destructive border-2 focus:border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                />
                <p className="text-xs text-destructive mt-1 h-4">
                  {errors[field]}
                </p>
              </div>
            ))}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={formData.countryCode || ""}
                onValueChange={(value) =>
                  handleInputChange("countryCode", value)
                }
              >
                <SelectTrigger className="w-full sm:w-[140px] bg-card text-foreground border-border">
                  <SelectValue placeholder="Select country" />
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
                placeholder="1234567890"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="flex-1 bg-card text-foreground placeholder:text-muted-foreground border-border focus:border-primary transition-colors"
              />
            </div>
            <p className="text-xs text-destructive mt-1 h-4">{errors.phone}</p>
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm font-semibold mb-1">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`bg-card text-foreground placeholder:text-muted-foreground transition-all ${
                errors.email
                  ? "border-destructive border-2 focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            <p className="text-xs text-destructive mt-1 h-4">{errors.email}</p>
          </div>

          {/* Password */}
          <div>
            <Label className="text-sm font-semibold mb-1">
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full pr-10 bg-card text-foreground placeholder:text-muted-foreground transition-all ${
                  errors.password
                    ? "border-destructive border-2 focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-destructive mt-1 h-4">
              {errors.password}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded transition-all duration-200 mt-6 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : <>Create account →</>}
          </button>
        </form>

        {/* OR divider */}
        <div className="flex items-center my-6">
          <span className="grow h-px bg-border"></span>
          <span className="px-3 text-muted-foreground uppercase text-xs">
            OR
          </span>
          <span className="grow h-px bg-border"></span>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <GoogleSigninButton />
          <FacebookSigninButton />
        </div>

        <p className="text-center text-sm text-primary cursor-default">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="text-blue-700 hover:text-primary-glow transition-smooth underline cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
