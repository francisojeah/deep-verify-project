import { ReactNode } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <NavBar />
      <div className="flex flex-col w-full h-full max-w-[81rem] px-4 my-36">
        {children}
      </div>
      <Footer/>
    </div>
  );
};

export default PageLayout;
