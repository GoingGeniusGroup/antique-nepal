import ResetPassword from "@/components/form/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6 sm:py-8 text-foreground dark:text-foreground">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6">
        <div className="text-2xl sm:text-3xl text-primary font-bold mb-6">
          <h1 className="text-4xl font-cinzel font-bold text-primary mb-2">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your new password to regain access.
          </p>
        </div>
        <ResetPassword />;
      </div>
    </div>
  );
}
