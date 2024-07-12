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
    answer: "DeepVerify is a tool that uses advanced AI algorithms to detect deepfakes in audio, images, and videos.",
  },
  {
    question: "How does DeepVerify work?",
    answer: "DeepVerify analyzes media files using AI models trained to identify signs of manipulation and synthetic content.",
  },
  {
    question: "Can DeepVerify detect real-time deepfakes?",
    answer: "Yes, DeepVerify can analyze and verify the integrity of real-time video streams.",
  },
  // Add more FAQ items as needed
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
