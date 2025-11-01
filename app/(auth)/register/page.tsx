import Signup from "@/components/form/signup-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="pt-16 md:pt-20">
      <Signup />
      <Link href={"/auth-buttons"}>
        <Button value={"back"} />
      </Link>
    </div>
  );
};

export default RegisterPage;
