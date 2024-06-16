import { ReactNode } from "react";

export const inputStyles = `text-white p-4 px-4 rounded-md bg-magic-gray-2 placeholder-gray-500`;
export const InputLayout: React.FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => {
  return (
    <div className={`${className ?? ""} flex flex-col gap-2`}>{children}</div>
  );
};
