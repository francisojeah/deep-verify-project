import React, { useState } from 'react';
import { Accordion } from "flowbite-react";
import HeaderIllustration from './HeaderIllustration';

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "What is DeepVerify?",
    answer: "DeepVerify is an advanced AI tool designed to detect deepfakes in political media, including images and videos. It utilizes state-of-the-art machine learning models to identify manipulated or synthetic content.",
  },
  {
    question: "How does DeepVerify work?",
    answer: "DeepVerify analyzes political images and videos using specialized AI models. The tool employs ensemble learning techniques, combining predictions from various models to enhance accuracy and identify signs of manipulation effectively.",
  },
  {
    question: "Which models are used in DeepVerify?",
    answer: "DeepVerify uses a combination of advanced models, including XceptionNet and EfficientNet-B4 for image analysis, and 3D ResNet and CNN-LSTM for video analysis. This ensemble approach improves the accuracy of deepfake detection.",
  },
  {
    question: "What types of media can DeepVerify analyze?",
    answer: "DeepVerify is designed to analyze both images and videos. It supports common formats such as JPG, JPEG, PNG for images, and MP4, AVI, MOV for videos.",
  },
  {
    question: "How can I use DeepVerify?",
    answer: "You can use DeepVerify by uploading your media files through the web application. The system will process the files and provide a report on whether they contain deepfakes, along with a confidence score indicating the likelihood of manipulation.",
  },
  {
    question: "What are the benefits of using DeepVerify?",
    answer: "DeepVerify offers robust detection capabilities specifically tailored for political media. By leveraging advanced machine learning techniques, it helps ensure the integrity of visual and video content, making it a valuable tool for journalists, researchers, and the public.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16">
      <HeaderIllustration text={"faqs"} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <p className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center text-black dark:text-white">Frequently Asked Questions</p>
        <p className="text-lg leading-relaxed text-black dark:text-white opacity-70 text-center">
          Find answers to the most common questions about Deep-Verify.
        </p>
        <Accordion className="border-0 flex flex-col gap-6">
            {(faqData || [])?.map(
              ({ question, answer }: any, index: number) => (
                <Accordion.Panel
                  key={index}
                  onClick={() => handleToggle(index)}
                >
                  <div onClick={() => handleToggle(index)} className='border border-neutral-300 dark:border-neutral-500 p-4 rounded-2xl'>
                    <Accordion.Title
                      style={{ backgroundColor: "unset", border: "none" }}
                    >
                      <p
                        className={`self-center ${openIndex == index ? "text-custom-primary border-custom-primary" : "text-black dark:text-white"} text-lg font-medium`}
                      >
                        {question}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      style={{ backgroundColor: "unset", border: "none" }}
                      >
                      <p className="py-4 leading-8 text-black dark:text-white opacity-70 font-medium">{answer}</p>
                    </Accordion.Content>
                  </div>
                </Accordion.Panel>
              )
            )}
          </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
