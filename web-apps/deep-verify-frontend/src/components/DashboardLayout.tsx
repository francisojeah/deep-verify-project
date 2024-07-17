import { ReactNode, useState } from "react";
import NavBar from "./NavBar";
import SideMenu from "./SideMenu";

interface LayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col items-center w-full h-screen min-h-screen">
      <NavBar />

      <div
        className="flex md:p-0 max-w-[90rem] w-full z-0 mt-[7.5rem]"
        style={{ height: "calc(100vh - 7.5rem)" }}
      >
        <div
          className={`hidden sm:flex top-16 pb-4 static h-full z-0 transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "w-60" : "w-20"
          }`}
          style={{ height: "calc(100vh - 7.5rem)" }}
          id="side-menu"
        >
          <SideMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
        <div
          className={`flex-1 pb-4 overflow-x-auto md:overflow-y-scroll h-screen px-4 mb-8 transition-all duration-300 
             lg:ml-16 md:ml-8 
        `}
          style={{ height: "calc(100vh - 7.5rem)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
