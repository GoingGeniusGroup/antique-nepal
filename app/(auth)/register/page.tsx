import Signup from "@/components/form/signup-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const RegisterPage = () => {
  return (
    <div>
      <Signup />
      <Link href={"/auth-buttons"}>
        <Button value={"back"} />
      </Link>
    </div>
  );
};

export default RegisterPage;
