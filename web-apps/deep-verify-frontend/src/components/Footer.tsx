import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 border-t border-neutral-300 dark:border-neutral-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-center">
          <div className="text-center md:text-left flex flex-col gap-2">
          <Link className="flex justify-center md:justify-start gap-4" to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="w-fit h-[2.5rem]"
          />
          <p className="self-center text-black justify-center md:justify-start  whitespace-nowrap text-xl md:text-[1.375rem] font-bold dark:text-white">
            Deep Verify
          </p>
        </Link>
            <p className="mt-2 text-sm text-black dark:text-white opacity-70">
            Safeguarding Political Integrity with Advanced Deepfake Detection Technology
              </p>
          </div>
          <div className="flex justify-between gap-10">
            <a
              href={"https://www.linkedin.com/in/francis-okocha-ojeah/"}
              target="_blank"
            >
              <div className="p-2.5 border border-neutral-300 dark:border-neutral-500 rounded-lg">
                <FaLinkedinIn className="text-black dark:text-white h-fit w-[1.2rem]" />
              </div>
            </a>
            <a
              href={"https://github.com/francisojeah"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="p-2.5 border border-neutral-300 dark:border-neutral-500 rounded-lg">
                <FaGithub className="text-black dark:text-white h-fit w-[1.2rem]" />
              </div>
            </a>
            <a href={"https://twitter.com/FrancisOjeah"} target="_blank">
              <div className="p-2.5 border border-neutral-300 dark:border-neutral-500 rounded-lg">
                <FaXTwitter className="text-black dark:text-white h-fit w-[1.2rem]" />
              </div>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t text-sm border-neutral-300 dark:border-neutral-500 pt-4 text-center text-black dark:text-white opacity-70">
          &copy; {new Date().getFullYear()} Deep-Verify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
