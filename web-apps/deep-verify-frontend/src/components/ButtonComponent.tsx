import { ReactNode } from "react";

interface ButtonComponentProps {
  extraStyles?: string;
  children: ReactNode;
}

const ButtonComponent = ({ children, extraStyles }: ButtonComponentProps) => {
  return (
    <div className={`py-3 px-6 flex gap-2 justify-center items-center rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-300 ${extraStyles}`}>
      {children}
    </div>
  );
};

export default ButtonComponent;
