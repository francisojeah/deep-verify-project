import React from "react";
import HeaderIllustration from "./HeaderIllustration";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Image Deepfake Detection",
      description:
        "Identify fake images with high precision, ensuring media authenticity.",
      icon: "/assets/icons/image-icon.svg",
    },
    {
      title: "Video Deepfake Detection",
      description:
        "Analyze and verify the integrity of video content effortlessly.",
      icon: "/assets/icons/video-icon.svg",
    },
  ];

  return (
    <section className="py-16 text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderIllustration text={"Features"} />
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 ">
            Our <span className="text-custom-primary">Features</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black dark:text-white opacity-70">
            Deep-Verify offers a comprehensive suite of tools to detect
            deepfakes across various media formats.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500"
            >
              <div className="text-5xl mb-6 border border-neutral-300 dark:border-neutral-500  p-4 w-fit rounded-2xl">
                <img className="w-12 h-12" src={feature.icon} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-black dark:text-white opacity-70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
