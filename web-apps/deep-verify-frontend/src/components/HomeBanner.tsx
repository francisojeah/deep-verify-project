import { Link } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import { FiArrowUpRight } from "react-icons/fi";

const HomeBanner = () => {
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto py-20 md:px-8 p-4 text-black dark:text-white text-center rounded-2xl border border-medium-purple-400 bg-medium-purple-50 dark:bg-medium-purple-950 md:dark:bg-opacity-70  relative overflow-hidden">
        <div className="flex flex-col justify-center items-center gap-8 relative">
          <p className="max-w-4xl font-bold lg:text-4xl md:text-3xl text-xl text-center flex">
            Explore our advanced deepfake detection technology
          </p>
          <Link to={"/login"}>
            <ButtonComponent>
              Get Started <FiArrowUpRight />
            </ButtonComponent>
          </Link>
        </div>
        <div
          className="absolute bottom-0 right-0 mb-4 mr-4 md:flex hidden w-40 h-40 bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url(/assets/icons/shield-icon.svg)`,
          }}
        />
      </div>
    </section>
  );
};

export default HomeBanner;
