import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Container({ children }: Props) {
  return <section className="max-w-6xl mx-auto p-5 w-full">{children}</section>;
}
export default Container;
