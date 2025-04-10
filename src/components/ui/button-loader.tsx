import { ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { LoaderCircleIcon } from "lucide-react";

interface ButtonLoaderProps extends ComponentProps<typeof Button> {
  children: ReactNode;
  isPending: boolean;
}

const ButtonLoader = ({ children, isPending, ...props }: ButtonLoaderProps) => {
  return (
    <Button disabled={isPending || props.disabled} {...props}>
      {isPending && <LoaderCircleIcon className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </Button>
  );
};
export default ButtonLoader;
