import { Suspense } from "react";
import EmailVerificationContent from "./EmailVerificationContent";

export default function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return (
    <Suspense fallback={<div>Verifying your email...</div>}>
      <EmailVerificationContent token={searchParams.token} />
    </Suspense>
  );
}
