"use client";

import SignUp from "@/components/auth/SignUp";
import { Button } from "@/components/ui/button";

export default function Home() {
  const handlClick = () => {
    alert("button clicked");
  };
  return (
    <div>
      <Button onClick={handlClick} variant={"destructive"}>
        Click me
      </Button>
      <Button onClick={handlClick} variant={"outline"}>
        Click Aj
      </Button>
      <Button onClick={handlClick} variant={"ghost"}>
        Click Sushant
      </Button>

      <div className="">
        <SignUp />
      </div>
    </div>
  );
}
