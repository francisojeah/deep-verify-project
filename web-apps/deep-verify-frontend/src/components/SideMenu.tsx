import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { appApi } from "../store/slices/appSlice";
import { logoutUser } from "../store/slices/userSlice";
import LogoutIcon from "../assets/icons/LogoutIcon";
import DashboardIcon from "../assets/icons/DashboardIcon";
import MenuIcon from "../assets/icons/MenuIcon";
import CloseIcon from "../assets/icons/CloseIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";
import { FaHistory } from "react-icons/fa";


export const sideMenus = [
  {
    title: "Dashboard",
    link: "dashboard",
    icon: <DashboardIcon />,
    isActive: true,
  },
  {
    title: "Detection History",
    link: "history",
    icon: <FaHistory size={22} />,
    isActive: false,
  },
  
];

const SideMenu = ({ isMenuOpen, toggleMenu }:any) => {
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(appApi.util.resetApiState());
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <div
      className={`relative h-full ${
        isMenuOpen ? "w-60" : "w-20"
      } transition-all duration-300 bg-medium-purple-600 rounded-3xl py-8`}
    >
      <button
        onClick={toggleMenu}
        className={`absolute flex ${isMenuOpen ? "right-4" : "left-4"} p-2 rounded`}
      >
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div className="flex flex-col h-full justify-between mt-16 pb-14 px-4">
        <div className="flex flex-col gap-4 h-full">
          {sideMenus.map(({ title, link, icon }, index) => (
            <Link to={`/${link}`} key={index}>
              <button
                className={`w-full py-3 flex items-center gap-2 text-[#F0F0F0] focus:outline-none ${
                  isMenuOpen ? "px-3" : "justify-center"
                }`}
              >
                {icon}
                {isMenuOpen && (
                  <span className="text-white text-base font-medium">
                    {title}
                  </span>
                )}
              </button>
            </Link>
          ))}
         <a href={`mailto:sibas@pau.edu.ng`}>
              <button
                className={`w-full py-3 flex items-center gap-2 focus:outline-none ${
                  isMenuOpen ? "px-3" : "justify-center"
                }`}
              >
                <SettingsIcon/>
                {isMenuOpen && (
                  <span className="text-white text-base font-medium">
                    Settings
                  </span>
                )}
              </button>
            </a>
        </div>
        <button
            className={`w-full py-3 flex items-center gap-2 focus:outline-none ${
              isMenuOpen ? "px-3" : "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogoutIcon />
            {isMenuOpen && (
              <span className="text-white text-base font-medium">Logout</span>
            )}
          </button>
      </div>
    </div>
  );
};

export default SideMenu;
