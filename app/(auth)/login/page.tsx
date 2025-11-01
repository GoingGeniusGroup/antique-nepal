import SignIn from "@/components/form/signin-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <SignIn />
      <Link href={"/auth-buttons"}>
        <Button>Back</Button>
      </Link>
    </div>
  );
};

export default LoginPage;
