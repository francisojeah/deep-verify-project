import React from "react";
import HeaderIllustration from "./HeaderIllustration";

const useCases = [
  {
    title: "Media Verification",
    description:
      "Ensure the authenticity of news and media content, preventing the spread of misinformation.",
    icon: "/assets/icons/shield-icon.svg",
  },
  {
    title: "Identity Checks",
    description:
      "Add a manipulation check to onboarding and verification flows that accept a submitted photograph.",
    icon: "/assets/icons/lock-icon.svg",
  },
  {
    title: "Investigative Research",
    description:
      "Give investigators an extra signal on a suspect photograph, alongside provenance and source checks.",
    icon: "/assets/icons/magnifier-icon.svg",
  },
  {
    title: "Social Media",
    description:
      "Protect social media platforms from deepfake content, ensuring a safer online community.",
    icon: "/assets/icons/thumbs-up-icon.svg",
  },
  {
    title: "Dataset Screening",
    description:
      "Flag likely manipulated faces in an image collection before it is used for training or publication.",
    icon: "/assets/icons/analysis-icon.svg",
  },
  {
    title: "Corporate Communications",
    description:
      "Safeguard corporate communications and public relations from deepfake threats.",
    icon: "/assets/icons/dart-icon.svg",
  },
];

const UseCasesSection: React.FC = () => {
  return (
    <section className="py-16 text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeaderIllustration text={"Use Cases"} />
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 ">
            <span className="text-custom-primary">Applications</span> of Deep
            Verify
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black dark:text-white opacity-70">
            Discover how Deep-Verify can be utilized across various industries
            to ensure media authenticity.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500"
            >
              <div className="text-5xl mb-6 border border-neutral-300 dark:border-neutral-500 p-4 w-fit rounded-2xl">
                <img className="w-12 h-12" src={useCase.icon} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {useCase.title}
              </h3>
              <p className="text-black dark:text-white opacity-70">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
