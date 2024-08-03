import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";

const HeroSection = () => {
  return (
    <div>
      <div className="relative top-0 z-[-2] h-full w-full">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px] dark:bg-[rgba(109,90,244,0.5)]"></div>
      </div>

      <section className="relative overflow">
      <div className="absolute inset-0 z-[-1]">
          <img
            src="/assets/icons/left-donut.svg"
            alt="Left Donut"
            className="absolute left-0 top-0 h-[10rem] w-[10rem] sm:h-[12rem] sm:w-[12rem] md:h-[22rem] md:w-[22rem] animate-left-float-in-out"
          />
          <img
            src="/assets/icons/right-donut.svg"
            alt="Right Donut"
            className="absolute right-0 bottom-0 h-[10rem] w-[10rem] sm:h-[12rem] sm:w-[12rem] md:h-[22rem] md:w-[22rem] animate-right-float-in-out"
          />
        </div>
        <div className="relative z-20 mx-auto flex max-w-6xl flex-col gap-4 items-center justify-center md:px-8 ">
          <div className="relative z-10 mb-4 inline-block rounded-full px-3 py-1.5 text-xs dark:bg-[#262626] bg-[#F1F1F1] text-black dark:text-white border-2 border-neutral-300 dark:border-[#2E2E2E]">
            Advanced Deepfake Detection Technology 🔍
          </div>

          <p className="mb-3 text-center font-bold dark:text-white text-4xl leading-tight lg:text-7xl">
            Detect Political<br />
            <span className="relative whitespace-nowrap overflow-visible w-full">
              <span className="invisible">Image Deepfakes</span>
              <div className="cube-spinner h-full">
                <div className="face-2">Image Deepfakes</div>
                <div className="face-3">Video Deepfakes</div>
              </div>
            </span>{" "}
            <br />
            with Confidence
          </p>
          <p className="mb-9 max-w-2xl text-base text-center leading-relaxed dark:text-zinc-400 md:text-2xl md:leading-relaxed">
            Safeguarding Political Integrity with Advanced Deepfake Detection Technology
          </p>
          <Link to={"/signup"}>
            <ButtonComponent>
              Get Started
              <FiArrowUpRight />
            </ButtonComponent>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
