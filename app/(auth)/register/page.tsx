"use client";

import PasswordForm from "@/components/form/password-form";
import PhoneVerificationForm from "@/components/form/phone-verification-form";
import { useState } from "react";

const RegisterPage = () => {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      {!isVerified ? (
        <PhoneVerificationForm onVerified={() => setIsVerified(true)} />
      ) : (
        <PasswordForm />
      )}
    </div>
  );
};

export default RegisterPage;
