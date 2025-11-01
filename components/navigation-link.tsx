"use client";

import Link from "next/link";
import { useNavigation } from "@/contexts/navigation-context";
import { ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export function NavigationLink({
  href,
  children,
  className,
  onClick,
  ...props
}: NavigationLinkProps) {
  const { setIsNavigating } = useNavigation();

  const handleClick = () => {
    setIsNavigating(true);
    onClick?.();
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

