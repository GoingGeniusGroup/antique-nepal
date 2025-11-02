"use client";

import { useState } from "react";
import PhoneVerificationForm from "@/components/form/phone-verification-form";
import PasswordForm from "@/components/form/password-form";

const RegisterPage = () => {
  const [verifiedPhone, setVerifiedPhone] = useState<{
    prefix: string;
    phone: string;
  } | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>

      <div className="relative z-10">
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
  );
};

export default RegisterPage;
