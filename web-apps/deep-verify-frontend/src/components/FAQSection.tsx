import React, { useState } from "react";
import { Accordion } from "flowbite-react";
import HeaderIllustration from "./HeaderIllustration";
import { BENCHMARKS } from "../lib/benchmark";

export interface FAQItem {
  question: string;
  answer: string;
}

/** Built from the committed benchmark runs so the copy cannot drift from the data. */
const accuracyAnswer = (): string => {
  if (BENCHMARKS.length === 0) {
    return "No benchmark has been run yet, so no accuracy figure is published. Nothing is quoted here that has not been measured.";
  }

  const measured = [...BENCHMARKS].sort((a, b) => b.rocAuc - a.rocAuc);
  const best = measured[0];
  const worst = measured[measured.length - 1];
  const spread =
    measured.length > 1
      ? ` on ${best.dataset} it reaches ${(best.rocAuc * 100).toFixed(1)}% ROC-AUC, and on ${worst.dataset} the same model on the same code drops to ${(worst.rocAuc * 100).toFixed(1)}%.`
      : ` on ${best.dataset} it reaches ${(best.rocAuc * 100).toFixed(1)}% ROC-AUC.`;

  return (
    "That depends entirely on what it is looking at, which is why no single headline figure is quoted:" +
    spread +
    " Every run, and the raw output behind it, is published in the repository."
  );
};

export const faqData: FAQItem[] = [
  {
    question: "What is DeepVerify?",
    answer:
      "DeepVerify tells you how likely it is that a face in a photograph was digitally manipulated. You upload an image, the face in it is located and scored by a CLIP ViT-L/14 detector, and you get a percentage back along with the evidence for how far to trust it.",
  },
  {
    question: "What can it analyse?",
    answer:
      "Still images only - JPG and PNG, up to 10MB, containing at least one visible face. Video and audio are not supported. If no face is found, it returns an error rather than a score, because the model reads facial artefacts and a number for a face-free image would mean nothing.",
  },
  {
    question: "How accurate is it?",
    answer: accuracyAnswer(),
  },
  {
    question: "Why a percentage rather than a yes or no?",
    answer:
      "Because the honest answer is a likelihood, not a verdict. The 50% threshold that turns the score into 'likely manipulated' is a default, not a calibrated operating point, so results close to it are genuinely uncertain and are worth treating that way.",
  },
  {
    question: "Where does the model come from?",
    answer:
      "It runs yermandy/deepfake-detection, a CLIP ViT-L/14 encoder with LN-tuning published under MIT by Yermakov et al. and trained by them on FaceForensics++. DeepVerify builds the detection pipeline, the API, the benchmarks and the interface around those published weights.",
  },
  {
    question: "Should I rely on the result?",
    answer:
      "Treat it as one signal among several, never as proof. It was trained on face-swap and reenactment artefacts, so newer manipulation families are missed more often, and heavy compression or low resolution degrade it further. It should not be the sole basis for a consequential judgement about a person.",
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
        <p className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center text-black dark:text-white">
          Frequently Asked Questions
        </p>
        <p className="text-lg leading-relaxed text-black dark:text-white opacity-70 text-center">
          Find answers to the most common questions about Deep-Verify.
        </p>
        <Accordion className="border-0 flex flex-col gap-6">
          {(faqData || [])?.map(({ question, answer }: any, index: number) => (
            <Accordion.Panel key={index} onClick={() => handleToggle(index)}>
              <div
                onClick={() => handleToggle(index)}
                className="border border-neutral-300 dark:border-neutral-500 p-4 rounded-2xl"
              >
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
                  <p className="py-4 leading-8 text-black dark:text-white opacity-70 font-medium">
                    {answer}
                  </p>
                </Accordion.Content>
              </div>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
