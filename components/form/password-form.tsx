"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/app/actions/auth/register";
import toast from "react-hot-toast";

interface PasswordFormProps {
  prefix: string;
  phone: string;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ prefix, phone }) => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !rePassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const result = await registerUser({ prefix, phone, password });
    setIsLoading(false);

    if (result.success) {
      toast.success("Account created successfully!");
      route.push("/login");
    } else {
      toast.error(result.error || "Registration failed");
      console.log(result.error);
    }
    console.log(prefix);
    console.log(phone);
    console.log(password);
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Set Password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div className="relative space-y-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
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

          {/* Re-enter Password */}
          <div className="relative space-y-2">
            <Label htmlFor="rePassword">
              Re-enter Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rePassword"
              type={showRePassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="border border-border focus:border-primary bg-background pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted-foreground"
              onClick={() => setShowRePassword((prev) => !prev)}
            >
              {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordForm;
