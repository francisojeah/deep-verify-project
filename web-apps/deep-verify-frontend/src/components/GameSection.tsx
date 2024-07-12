import React from "react";
import ButtonComponent from "./ButtonComponent";
import { FiArrowUpRight } from "react-icons/fi";
import HeaderIllustration from "./HeaderIllustration";
import { Link } from "react-router-dom";

const GameSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-8 py-16 w-full text-black dark:text-white">
      <HeaderIllustration text={"Game"} />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex md:flex-row flex-col md:gap-16 overflow-hidden">
        <div className="flex  justify-center md:p-8 md:border md:bg-medium-purple-50 md:border-medium-purple-400 md:dark:bg-medium-purple-950 md:dark:bg-opacity-70 rounded-2xl items-center w-full">
          <img
            src={"/assets/icons/rocket-icon.svg"}
            alt="Logo"
            className="w-auto md:h-60 h-28"
          />
        </div>
        <div className="mx-auto py-8 text-center">
          <div className="flex flex-col gap-8 justify-center items-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Play the Deepfake Detection <span className="text-custom-primary">Game!</span>
            </p>
            <p className="text-lg leading-relaxed text-black dark:text-white opacity-70">
              Test your skills in identifying deepfakes with our interactive
              game. Sharpen your abilities and challenge yourself to spot the
              fakes in audio, images, and videos!
            </p>
            <Link to={"/game"}>
          <ButtonComponent>
            Play Now <FiArrowUpRight />
            </ButtonComponent>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GameSection;
