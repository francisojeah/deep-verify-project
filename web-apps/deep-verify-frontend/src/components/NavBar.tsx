import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { UserStateProps } from "../store/interfaces/user.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { appApi } from "../store/slices/appSlice";
import { logoutUser } from "../store/slices/userSlice";
import { Link, useLocation } from "react-router-dom";
import { updateMenu } from "../store/slices/menuSlice";
import Toggle from "./Toggle";
import { FiArrowUpRight } from "react-icons/fi";
import ButtonComponent from "./ButtonComponent";

const NavBar = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user
  );

  const location = useLocation();
  const dispatch = useDispatch();
  const activeNavBarMenu = useSelector<RootState>((state) => state.menu);

  const { menu }: any = activeNavBarMenu;

  const handleNavBarMenuClick = (navBarMenu: number) => {
    dispatch(updateMenu(navBarMenu));
  };

  const menus = [
    {
      title: "Home",
      link: "home",
      isActive: true,
    },
    {
      title: "About",
      link: "about",
      isActive: false,
    },
    {
      title: "Detection",
      link: "dashboard",
      isActive: false,
    },
    {
      title: "Game",
      link: "game",
      isActive: false,
    },
    // {
    //   title: "API Documentation",
    //   link: "api-docs",
    //   isActive: false,
    // },
    // {
    //   title: "Industry News",
    //   link: "news",
    //   isActive: false,
    // },
    {
      title: "Contact",
      link: "contact",
      isActive: false,
    },
  ];

  const handleLogout = useCallback(() => {
    dispatch(appApi.util.resetApiState());
    dispatch(logoutUser());
  }, []);

  useEffect(() => {
    const pathName = location.pathname
      .split("/")
      .filter((element) => element !== "");
    const pathTitle = pathName[0];
    const navBarMenuTitle = menus.find(
      (navBarmenu) => navBarmenu.link === pathTitle
    )?.title;

    if (navBarMenuTitle && navBarMenuTitle !== activeNavBarMenu) {
      handleNavBarMenuClick(
        menus.findIndex((navBarmenu) => navBarmenu.title === navBarMenuTitle)
      );
    }
  }, [location.pathname, menus, activeNavBarMenu, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex flex-col w-full justify-between items-center z-30 top-0 left-0 fixed backdrop-blur-md  ${hasScrolled ? "border-b dark:border-neutral-500" : ""}`}
    >
      <div className="flex w-full max-w-[90rem] h-full items-center justify-between py-4 px-4">
        <Link className="flex h-full gap-4" to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="w-fit h-[2.5rem]"
          />
          <p className="self-center text-black  whitespace-nowrap text-xl md:text-[1.375rem] font-bold dark:text-white">
            Deep Verify
          </p>
        </Link>

        <div className="lg:flex hidden text-[0.875rem] gap-6 h-full whitespace-nowrap">
          {menus.map(({ title, link }, index) => (
            <Link
              className={`w-full h-full py-1 ${
                menu === index
                  ? "border-b-2 border-b-light-primaryButtonBg text-light-primaryButtonBg dark:border-b-dark-primaryButtonBg dark:text-dark-primaryButtonBg font-semibold"
                  : "text-black dark:text-white"
              }`}
              to={`/${link}`}
              key={index}
            >
              <div className={`flex w-full h-full items-center`}>{title}</div>
            </Link>
          ))}
        </div>
        <div className="flex items-center md:gap-8">
          <Toggle />
          <div className="hidden lg:flex md:order-2 gap-1 md:gap-3">
            {userSlice?.user?.email ? (
              <Dropdown
                arrowIcon={true}
                inline
                className="md:w-[20%]"
                label={
                  <div className="flex items-center gap-4">
                    <Avatar
                      alt="User"
                      img={userSlice?.user?.profileImage}
                      rounded
                    />
                  </div>
                }
              >
                <DropdownHeader>
                  <p className="text-xs font-bold text-custom-primary-1">{`${
                    userSlice?.user?.firstname || "Coupe"
                  } ${userSlice?.user?.lastname || "User"}`}</p>
                  <span className="block truncate text-sm font-medium">
                    Coupe de Escriva user
                  </span>
                </DropdownHeader>
                <DropdownItem onClick={handleLogout} className="text-base">
                  Sign out
                </DropdownItem>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-8">
                <Link to={"/login"}>
                  <div className="flex justify-center items-center w- dark:text-white text-black">
                    <p className="text-sm">Sign in</p>
                  </div>
                </Link>
                <Link to={"/login"}>
                  <ButtonComponent extraStyles="">
                    Get Started
                    <FiArrowUpRight />
                  </ButtonComponent>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex lg:hidden md:order-2 gap-1 md:gap-3">
          <Dropdown
            arrowIcon={false}
            inline
            className="md:w-[35%]"
            label={
              userSlice?.user?.email ? (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar
                      alt="User"
                      img={userSlice?.user?.profileImage}
                      rounded
                    />
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 17 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h15M1 7h15M1 13h15"
                      />
                    </svg>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </div>
              )
            }
          >
            <DropdownHeader>
              <p className="text-xs font-bold text-custom-primary-1">{`${
                userSlice?.user?.firstname || "Coupe"
              } ${userSlice?.user?.lastname || "User"}`}</p>
              <span className="block truncate text-sm font-medium">
                Coupe de Escriva user
              </span>
            </DropdownHeader>
            {menus.map(({ title, link }, index) => (
              <DropdownItem className="w-full" key={index}>
                <Link className="w-full" to={`/${link}`} key={index}>
                  <div className="flex w-full text-base">{title}</div>
                </Link>
              </DropdownItem>
            ))}
            <DropdownDivider />

            {userSlice?.user?.email ? (
              <DropdownItem onClick={handleLogout} className="text-base">
                Sign out
              </DropdownItem>
            ) : (
              <DropdownItem className="w-full">
                <Link to={"/login"}>
                  <div className="w-[5.5rem] h-[2.5rem]  flex justify-center items-center bg-custom-primary-1 hover:bg-custom-primary-2 dark:text-white text-black rounded-[0.5rem] ">
                    <p className="text-sm">Login</p>
                  </div>
                </Link>
              </DropdownItem>
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
