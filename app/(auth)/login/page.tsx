"use client";

import SignIn from "@/components/form/signin-form";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left section (image or branding) */}
      <div className="hidden md:flex w-1/2 bg-[hsl(var(--mountain-light))] items-center justify-center">
        <img
          src="/login-illustration.svg"
          alt="Login Illustration"
          className="w-3/4 h-auto"
        />
      </div>

      {/* Right section (form) */}
      <div className="flex flex-1 items-center justify-center p-6 bg-[hsl(var(--paper))]">
        <SignIn />
      </div>
    </div>
  );
};

export default LoginPage;
