"use client";

import SigninForm from "@/components/form/signin-form";
import SideContent from "@/components/from-side-content";

const LoginPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-cover bg-center relative transition-colors duration-500"
      style={{
        backgroundImage: "url('/hemp-field.png')",
      }}
    >
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-center p-10 md:p-16 text-white">
          <SideContent />
        </div>

        {/* Right Section */}
        <div
          className="flex-1 flex items-center justify-center p-10 md:p-16 rounded-t-3xl md:rounded-none md:rounded-l-3xl shadow-xl backdrop-blur-sm bg-transparent"
          style={{
            background:
              "linear-gradient(to left, #D4BE96, rgba(212,190,150,0.85))",
          }}
        >
          <SigninForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
