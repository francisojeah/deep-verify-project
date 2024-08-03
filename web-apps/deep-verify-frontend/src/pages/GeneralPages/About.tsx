import { Link } from "react-router-dom";
import HeaderIllustration from "../../components/HeaderIllustration";
import ButtonComponent from "../../components/ButtonComponent";
import MetaTags from "../../components/MetaTags";
import PageLayout from "../../components/PageLayout";
import { FiArrowUpRight } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

const AboutPage = () => {
  return (
    <PageLayout>
      <>
        <MetaTags />
        <div className="w-full flex flex-col gap-24 text-black dark:text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction Section */}
          <div className="text-center flex flex-col mb-12 gap-8">
            <p className="text-center font-bold dark:text-white text-4xl leading-tight lg:text-7xl">
              Ensuring <span className="text-custom-primary">Trust</span> in
              Political Media
            </p>
            <p className="mt-4 text-xl lg:text-2xl leading-relaxed text-black dark:text-white opacity-70">
              Discover who we are, our mission, and our commitment to preserving
              media integrity in the political sphere.
            </p>
          </div>

          {/* Vision Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <HeaderIllustration text={"Vision"} />

            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-custom-primary">Vision</span>
            </p>
            <p className="mt-4 md:text-lg leading-relaxed text-black dark:text-white opacity-70">
              At DeepVerify, we envision a world where political media is free
              from manipulation, ensuring that citizens can make informed
              decisions based on genuine information. Our goal is to set a new
              standard for media authenticity in the political landscape.
            </p>
          </div>

          {/* Mission Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <HeaderIllustration text={"Mission"} />

            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-custom-primary">Mission</span>
            </p>
            <p className="mt-4 md:text-lg leading-relaxed text-black dark:text-white opacity-70">
              Our mission is to empower journalists, political analysts, and the
              public with robust tools to detect and combat deepfakes. Through
              innovative AI technology and dedicated research, we strive to
              safeguard the integrity of political discourse.
            </p>
          </div>

          {/* Values Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <HeaderIllustration text={"Values"} />

            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-custom-primary">Values</span>
            </p>
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
              <div className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500">
                <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Integrity and Transparency
                </p>
                <p className="text-black dark:text-white opacity-70">
                  We are committed to maintaining the highest standards of
                  honesty and openness in our technology and practices.
                </p>
              </div>
              <div className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500">
                <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Innovation and Excellence
                </p>
                <p className="text-black dark:text-white opacity-70">
                  We continually advance our technology to stay ahead of
                  deepfake tactics, ensuring top-notch performance and accuracy.
                </p>
              </div>
              <div className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500">
                <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Empowerment and Education
                </p>
                <p className="text-black dark:text-white opacity-70">
                  We are dedicated to providing tools and knowledge that empower
                  users to effectively detect and respond to media manipulation.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-12 flex flex-col gap-2">
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The DeepVerify <span className="text-custom-primary">Team</span>
            </p>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              {/* Francis Okocha-Ojeah */}
              <div className="flex flex-col gap-6 px-6 py-12 rounded-2xl border border-neutral-300 dark:border-neutral-500">
                <FaUser className="text-5xl w-full text-gray-900 dark:text-white" />
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Francis Okocha-Ojeah
                </p>
                <p className="text-black dark:text-white opacity-70">
                  Computer Science Student
                </p>
              </div>

              {/* Prof. Kingsley Ukaoha */}
              <div className="flex flex-col gap-6 px-6 py-12 rounded-2xl border border-neutral-300 dark:border-neutral-500">
                <FaUser className="text-5xl w-full text-gray-900 dark:text-white" />
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Prof. Kingsley Ukaoha
                </p>
                <p className="text-black dark:text-white opacity-70">
                  Project Supervisor
                </p>
              </div>
            </div>
          </div>

          {/* Project Context Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Project <span className="text-custom-primary">Context</span>
            </p>
            <p className="mt-4 md:text-lg leading-relaxed text-black dark:text-white opacity-70">
              DeepVerify is a final year project developed by Francis
              Okocha-Ojeah, a Computer Science student at Pan-Atlantic
              University. Guided by Prof. Kingsley Ukaoha, this project explores
              advanced techniques in deepfake detection specifically for
              political media. It aims to address challenges related to the
              authenticity of digital content in political contexts through
              sophisticated AI methodologies.
            </p>
          </div>

          {/* Acknowledgment Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <p className="text-4xl font-bold text-custom-primary mb-4">
              Acknowledgment
            </p>
            <p className="mt-4 md:text-lg leading-relaxed text-black dark:text-white opacity-70">
              I would like to express my heartfelt gratitude to God for His
              unwavering guidance throughout the development of DeepVerify.
              Special thanks to Prof. Kingsley Ukaoha for his invaluable
              supervision and support. I am deeply grateful to my family for
              their constant encouragement and belief in my work. The School of
              Science and Technology at Pan-Atlantic University provided
              essential resources and a supportive environment. My peers and
              colleagues also deserve thanks for their feedback and
              contributions to this project.
            </p>
          </div>

          {/* Contact Button Section */}
          <section className="w-full max-w-6xl mx-auto py-20 md:px-8 p-4 text-black dark:text-white text-center rounded-2xl border border-medium-purple-400 bg-medium-purple-50 dark:bg-medium-purple-950 md:dark:bg-opacity-70  relative overflow-hidden">
            <p className="text-3xl font-bold">Contact Us</p>
            <p className="mt-4 md:text-lg max-w-4xl mx-auto">
              Have questions or feedback about our deepfake detection solutions?
              Reach out to us!
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/contact">
                <ButtonComponent>
                  Contact Us <FiArrowUpRight />
                </ButtonComponent>
              </Link>
            </div>
          </section>
        </div>
      </>
    </PageLayout>
  );
};

export default AboutPage;
