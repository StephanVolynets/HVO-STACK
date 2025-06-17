import { ReactNode } from "react";

interface IRenderProps {
  children?: ReactNode;
  when?: boolean;
}

const Render = ({ when = true, children }: IRenderProps) => {
  if (!when) return null;

  return <>{children}</>;
};

export default Render;
