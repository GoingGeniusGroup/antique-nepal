"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/form/signin-form";
import SignUp from "@/components/form/signup-form";

export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="destructive" onClick={() => alert("button clicked")}>
          Click me
        </Button>
        <Button variant="outline" onClick={() => alert("button clicked")}>
          Click Aj
        </Button>
        <Button variant="ghost" onClick={() => alert("button clicked")}>
          Click Sushant
        </Button>
      </div>
    </div>
  );
}
