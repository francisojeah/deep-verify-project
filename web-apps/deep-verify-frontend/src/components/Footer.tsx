import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SOCIALS = [
  {
    href: "https://github.com/francisojeah",
    label: "GitHub",
    Icon: FaGithub,
  },
  {
    href: "https://www.linkedin.com/in/francis-okocha-ojeah/",
    label: "LinkedIn",
    Icon: FaLinkedinIn,
  },
  {
    href: "https://twitter.com/FrancisOjeah",
    label: "X",
    Icon: FaXTwitter,
  },
];

const Footer: React.FC = () => (
  <footer className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/assets/icons/logo.svg" alt="" className="h-7 w-auto" />
          <span className="font-display text-lg font-bold text-foreground">
            DeepVerify
          </span>
        </Link>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Image deepfake detection, measured in the open. Every performance
          figure published here comes from a benchmark run committed to the
          repository.
        </p>
      </div>

      <div className="flex items-center gap-5">
        {SOCIALS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>

    <p className="mt-10 text-xs text-muted-foreground">
      &copy; {new Date().getFullYear()} DeepVerify. Model weights are{" "}
      <a
        href="https://huggingface.co/yermandy/deepfake-detection"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2"
      >
        yermandy/deepfake-detection
      </a>
      , published under MIT by their authors.
    </p>
  </footer>
);

export default Footer;
