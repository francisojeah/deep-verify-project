import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiGithub, FiMenu, FiX } from "react-icons/fi";

import { UserStateProps } from "../store/interfaces/user.interface";
import { RootState } from "../store/store";
import { appApi } from "../store/slices/appSlice";
import { logoutUser } from "../store/slices/userSlice";
import Toggle from "./Toggle";
import Button from "./ui/Button";

const REPO_URL = "https://github.com/francisojeah/deep-verify-project";

const LINKS = [
  { title: "Detect", to: "/" },
  { title: "About", to: "/about" },
];

const NavBar = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(appApi.util.resetApiState());
    dispatch(logoutUser());
  }, [dispatch]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signedIn = Boolean(userSlice?.user?.email);

  return (
    <header
      className={`fixed left-0 top-0 z-30 w-full backdrop-blur-md transition-colors duration-200 ${
        hasScrolled ? "bg-background/85" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/assets/icons/logo.svg" alt="" className="h-7 w-auto" />
          <span className="font-display text-lg font-bold text-foreground">
            DeepVerify
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map(({ title, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm transition-colors ${
                location.pathname === to
                  ? "font-semibold text-brand"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {title}
            </Link>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Source on GitHub"
          >
            <FiGithub size={18} />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Toggle />

          <div className="hidden items-center gap-3 md:flex">
            {signedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="text-foreground md:hidden"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="bg-background px-4 pb-5 sm:px-6 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map(({ title, to }) => (
              <Link key={to} to={to} className="text-sm text-foreground">
                {title}
              </Link>
            ))}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-foreground"
            >
              Source on GitHub
            </a>
            {signedIn ? (
              <>
                <Link to="/dashboard" className="text-sm text-foreground">
                  Dashboard
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-foreground">
                  Sign in
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="w-full">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
