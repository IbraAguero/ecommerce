"use client";

import React, { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  label?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, wrapperClassName, label, id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            id={id}
            disabled={disabled}
            {...props}
          />

          <Button
            disabled={disabled}
            type="button"
            variant="ghost"
            size="icon"
            className="absolute h-full top-0 right-0 mr-2 hover:bg-transparent focus-visible:ring-0"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px] text-muted-foreground" />
            ) : (
              <Eye className="h-[18px] w-[18px] text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
