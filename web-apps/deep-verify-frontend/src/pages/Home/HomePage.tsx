import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

import PageLayout from "../../components/PageLayout";
import MetaTags from "../../components/MetaTags";
import ImageAnalyser from "../../components/ImageAnalyser";
import { BENCHMARKS, BENCHMARK_SOURCE_URL } from "../../lib/benchmark";

const MODEL_CARD_URL =
  import.meta.env.VITE_MODEL_CARD_URL ??
  "https://huggingface.co/yermandy/deepfake-detection";

const READING = [
  {
    title: "The threshold is a default, not a verdict",
    body: "Anything at or above 50% is reported as likely manipulated. That line is not calibrated against any cost model, so a score sitting near it is genuinely uncertain rather than marginally decided.",
  },
  {
    title: "It knows some manipulations better than others",
    body: "The detector learned face-swap and reenactment artefacts. Lip-sync methods alter only the mouth and are missed more often, and fully synthetic faces from diffusion models are a different problem it was never shown.",
  },
  {
    title: "One signal, never proof",
    body: "Compression, low resolution and unusual lighting all degrade the score. Treat the result as evidence to weigh alongside provenance and source checks, not as an answer about a person.",
  },
];

const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

const HomePage: React.FC = () => (
  <PageLayout>
    <MetaTags />

    <section className="mx-auto w-full max-w-6xl">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
          Is this face real?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Upload a photo containing a face. You get the likelihood that it was
          digitally manipulated, the threshold behind that call, and the
          benchmarks the detector was actually measured on.
        </p>
      </div>

      <div className="mt-10">
        <ImageAnalyser />
      </div>
    </section>

    <section className="mx-auto mt-24 w-full max-w-6xl">
      <h2 className="font-display text-2xl font-bold text-foreground">
        How to read the number
      </h2>
      <div className="mt-8 grid gap-10 sm:grid-cols-3">
        {READING.map((item) => (
          <div key={item.title}>
            <h3 className="text-sm font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto mt-24 w-full max-w-6xl">
      <h2 className="font-display text-2xl font-bold text-foreground">
        Measured performance
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        No single headline figure is quoted, because a detector's score is a
        property of the manipulations it is shown as much as of the model. Both
        runs below use the same model, the same code and the same seed.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-3 pr-6 font-medium">Benchmark</th>
              <th className="py-3 pr-6 font-medium">Images</th>
              <th className="py-3 pr-6 font-medium">ROC-AUC</th>
              <th className="py-3 pr-6 font-medium">PR-AUC</th>
              <th className="py-3 font-medium">F1 @ 50%</th>
            </tr>
          </thead>
          <tbody>
            {BENCHMARKS.map((run) => (
              <tr key={run.dataset} className="align-top">
                <td className="py-4 pr-6">
                  <span className="font-medium text-foreground">
                    {run.dataset}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {run.note}
                  </span>
                </td>
                <td className="py-4 pr-6 tabular-nums text-muted-foreground">
                  {run.images.toLocaleString()}
                </td>
                <td className="py-4 pr-6 text-base font-semibold tabular-nums text-foreground">
                  {percent(run.rocAuc)}
                </td>
                <td className="py-4 pr-6 tabular-nums text-muted-foreground">
                  {percent(run.prAuc)}
                </td>
                <td className="py-4 tabular-nums text-muted-foreground">
                  {percent(run.f1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <a
          href={BENCHMARK_SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-brand transition-colors hover:text-brand-hover"
        >
          Raw benchmark output
          <FiArrowUpRight aria-hidden />
        </a>
        <a
          href={MODEL_CARD_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-brand transition-colors hover:text-brand-hover"
        >
          Model card
          <FiArrowUpRight aria-hidden />
        </a>
      </div>
    </section>
  </PageLayout>
);

export default HomePage;
