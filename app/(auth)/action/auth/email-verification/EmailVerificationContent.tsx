"use client";

import { verifyEmail } from "@/actions/email-verification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerificationContent({ token }: { token: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    async function verify() {
      const result = await verifyEmail(token);
      setMessage(result.message);
      if (result.success) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
    verify();
  }, [token, router]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
}
