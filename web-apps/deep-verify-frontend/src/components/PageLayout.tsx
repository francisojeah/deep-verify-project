import { ReactNode } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: LayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <NavBar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default PageLayout;
