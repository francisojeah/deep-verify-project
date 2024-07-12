import React from 'react';
import HeaderIllustration from './HeaderIllustration';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      title: 'Upload Your Media',
      description: 'Select the type of media you want to verify (audio, image, or video) and upload it to our platform.',
      icon: "/assets/icons/plus-icon.svg",
    },
    {
      title: 'AI Analysis',
      description: 'Our advanced AI models analyze the uploaded media to detect any deepfake manipulations.',
      icon: "/assets/icons/model-icon.svg",
    },
    {
      title: 'Get Results',
      description: 'Receive a detailed report on the authenticity of your media, along with confidence scores.',
      icon: "/assets/icons/analysis-icon.svg",
    },
  ];

  return (
    <section className="py-16 text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderIllustration text={"Steps"} />
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 ">
          How It <span className="text-custom-primary">Works</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black dark:text-white opacity-70">
          Follow these simple steps to verify the authenticity of your media files with Deep-Verify.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl transition-transform transform hover:scale-105 border border-neutral-300 dark:border-neutral-500"
            >
              <div className="text-5xl mb-6 border border-neutral-300 dark:border-neutral-500  p-4 w-fit rounded-2xl">
                <img className="w-12 h-12" src={step.icon} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-black dark:text-white opacity-70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
