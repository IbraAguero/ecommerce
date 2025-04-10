"use client";

import { Button } from "./ui/button";
import { ComponentProps, ReactNode } from "react";
import { signOut } from "next-auth/react";

interface Props extends ComponentProps<typeof Button> {
  children: ReactNode;
}

function ButtonLogout({ children, ...props }: Props) {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
export default ButtonLogout;
