"use client";

import { useState } from "react";
import PhoneVerificationForm from "@/components/form/phone-verification-form";
import PasswordForm from "@/components/form/password-form";
import SideContent from "@/components/from-side-content";

const RegisterPage = () => {
  const [verifiedPhone, setVerifiedPhone] = useState<{
    prefix: string;
    phone: string;
  } | null>(null);

  return (
    <div className="pt-16 md:pt-20">
      {" "}
      {/* Adjust based on your navbar height */}
      <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: "url('/hemp-field.png')" }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity duration-500"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full items-center justify-center">
          {/* Left Section (Hidden on mobile) */}
          <div className="flex-1 hidden md:flex items-center justify-center p-8 md:p-16 text-white">
            <SideContent />
          </div>

          {/* Right Section */}
          <div
            className="flex-1 flex items-start justify-center pt-12 md:pt-20 p-8 md:p-16  shadow-xl backdrop-blur-sm 
             bg-gradient-to-l from-[#D4BE96]/95 to-[#D4BE96]/30 min-h-[60vh] md:min-h-full"
          >
            <div className="w-full max-w-md md:max-w-lg">
              {!verifiedPhone ? (
                <PhoneVerificationForm
                  onVerified={(data) => setVerifiedPhone(data)} // pass phone data here
                />
              ) : (
                <PasswordForm
                  prefix={verifiedPhone.prefix}
                  phone={verifiedPhone.phone}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
