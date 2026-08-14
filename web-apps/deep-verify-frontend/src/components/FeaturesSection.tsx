import React from "react";
import HeaderIllustration from "./HeaderIllustration";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Face manipulation detection",
      description:
        "Upload a photo and get the likelihood that the face in it was digitally manipulated, with the decision threshold behind the call shown alongside it.",
      icon: "/assets/icons/image-icon.svg",
    },
    {
      title: "Automatic face detection",
      description:
        "The largest face is located and cropped before scoring, matching the way the detector was evaluated. No face, no score - it returns an error rather than a guess.",
      icon: "/assets/icons/magnifier-icon.svg",
    },
    {
      title: "Published benchmarks",
      description:
        "Every performance figure comes from a benchmark run committed to the repository, across two different manipulation families rather than one flattering set.",
      icon: "/assets/icons/analysis-icon.svg",
    },
    {
      title: "Open API",
      description:
        "The same detection pipeline is available over HTTP, so the model can be called from your own service instead of only through this interface.",
      icon: "/assets/icons/model-icon.svg",
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
            Image deepfake detection, measured in the open and served over an
            API you can call yourself.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 ">
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
