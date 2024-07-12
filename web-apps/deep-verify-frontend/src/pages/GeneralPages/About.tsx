import { Link } from "react-router-dom";
import HeaderIllustration from "../../components/HeaderIllustration";
import ButtonComponent from "../../components/ButtonComponent";
import MetaTags from "../../components/MetaTags";
import PageLayout from "../../components/PageLayout";
import { FiArrowUpRight } from "react-icons/fi";
import { Avatar } from "flowbite-react";

const AboutPage = () => {
  return (
    <PageLayout>
      <>
        <MetaTags />
        <div className="w-full flex flex-col gap-24 text-black dark:text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction Section */}
          <div className="text-center flex flex-col mb-12 gap-8">
            <p className="text-center font-bold dark:text-white text-4xl leading-tight lg:text-7xl">
              Empowering{" "}
              <span className="text-custom-primary">Authenticity</span> in
              Digital Media
            </p>
            <p className="mt-4 text-xl lg:text-2xl leading-relaxed text-black dark:text-white opacity-70">
              Explore who we are, our values, philosophy, and our vision for the
              future
            </p>
          </div>

          {/* Vision Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <HeaderIllustration text={"Vision"} />

            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-custom-primary">Vision</span>
            </p>
            <p className="mt-4 md:text-lg leading-relaxed text-black dark:text-white opacity-70">
              At DeepVerify, our vision is to create a digital landscape where
              individuals and organizations can trust the media they consume,
              free from manipulation and deception. Our ultimate goal is to set
              the standard for authenticity verification across digital
              platforms globally.
            </p>
          </div>

          {/* Mission Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <HeaderIllustration text={"Mission"} />

            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-custom-primary">Mission</span>
            </p>
            <p className="mt-4 md:text-lg leading-relaxed text-black dark:text-white opacity-70">
              Our mission is to empower individuals and businesses with the
              tools and knowledge to detect and mitigate deepfake threats
              effectively. Through cutting-edge technology and relentless
              innovation, we're committed to equipping our users with the means
              to distinguish real from fake in audio, images, and videos.
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
                  Trust and Integrity
                </p>
                <p className="text-black dark:text-white opacity-70">
                  We uphold the highest standards of trustworthiness and
                  integrity in all our endeavors.
                </p>
              </div>
              <div className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500">
                <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Innovation and Security
                </p>
                <p className="text-black dark:text-white opacity-70">
                  We continuously innovate to stay ahead of evolving deepfake
                  technologies, ensuring robust security for our users.
                </p>
              </div>
              <div className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500">
                <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  User Empowerment
                </p>
                <p className="text-black dark:text-white opacity-70">
                  We believe in democratizing access to deepfake detection
                  tools, empowering users to protect themselves and their
                  communities.
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
                <Avatar
                  alt="Francis Okocha-Ojeah"
                  img={"/assets/icons/profile.svg"}
                  rounded
                  className="rounded-full mx-auto"
                />
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Francis Okocha-Ojeah
                </p>
                <p className="text-black dark:text-white opacity-70">
                  Computer Science Student
                </p>
              </div>

              {/* Prof. Kingsley Ukaoha */}
              <div className="flex flex-col gap-6 px-6 py-12 rounded-2xl border border-neutral-300 dark:border-neutral-500">
                <Avatar
                  alt="Prof. Kingsley Ukaoha"
                  img={"/assets/icons/profile.svg"}
                  rounded
                  className="rounded-full mx-auto"
                />
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
              DeepVerify is a final year project by Francis Okocha-Ojeah as a
              Computer Science student at the School of Science and Technology,
              Pan-Atlantic University. Under the expert guidance of Prof.
              Kingsley Ukaoha, the project delves into advanced research and
              development in deepfake detection technology. DeepVerify aims to
              address the growing concerns about the authenticity of digital
              media by using cutting-edge AI solutions.
            </p>
          </div>

          {/* Acknowledgment Section */}
          <div className="text-center mb-12 flex flex-col gap-2">
            <p className="text-4xl font-bold text-custom-primary mb-4">
              Acknowledgment
            </p>
            <p className="mt-4 md:text-lg leading-relaxed text-black dark:text-white opacity-70">
              I would like to express my heartfelt gratitude to God for His
              unwavering guidance and blessings throughout the development of
              DeepVerify. Special thanks to Prof. Kingsley Ukaoha for his
              invaluable supervision and support, which have been instrumental
              in shaping this project. <br/><br/>I am deeply grateful to my parents and
              siblings for their constant encouragement and unwavering belief in
              my endeavors. The School of Science and Technology, Pan-Atlantic University, provided
              essential resources and a conducive environment that facilitated
              the realization of this project. Lastly, I extend my appreciation
              to my peers and colleagues whose contributions and feedback have
              greatly enriched this journey.
            </p>
          </div>

          {/* Contact Button Section */}
          <section className="w-full max-w-6xl mx-auto py-20 md:px-8 p-4 text-black dark:text-white text-center rounded-2xl border border-medium-purple-400 bg-medium-purple-50 dark:bg-medium-purple-950 md:dark:bg-opacity-70  relative overflow-hidden">
            <p className="text-3xl font-bold">Contact Us</p>
            <p className="mt-4 md:text-lg max-w-4xl mx-auto">
              Have questions or feedback? Reach out to us!
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
