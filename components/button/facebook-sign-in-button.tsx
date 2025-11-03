import React from "react";
import { Button } from "../ui/button";
import { FaFacebook } from "react-icons/fa";

const FacebookSigninButton = () => {
  return (
    <div>
      <Button
        type="button"
        className="w-full bg-[#1877F2] text-white hover:bg-[#166FE0] flex items-center justify-center gap-2 font-medium cursor-pointer"
      >
        <FaFacebook className="w-5 h-5 text-white" />
        Continue with Facebook
      </Button>
    </div>
  );
};

export default FacebookSigninButton;
