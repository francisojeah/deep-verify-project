import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

import MetaTags from "../../components/MetaTags";
import PageLayout from "../../components/PageLayout";
import Button from "../../components/ui/Button";
import { BENCHMARKS } from "../../lib/benchmark";

const REPO_URL = "https://github.com/francisojeah/deep-verify-project";

// Read from the committed runs rather than typed in, so the prose cannot drift
// from the data it is describing.
const ranked = [...BENCHMARKS].sort((a, b) => b.rocAuc - a.rocAuc);
const best = ranked[0];
const worst = ranked[ranked.length - 1];
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="mt-16 max-w-3xl">
    <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
    <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
      {children}
    </div>
  </section>
);

const AboutPage = () => (
  <PageLayout>
    <MetaTags title="About DeepVerify" />

    <div className="mx-auto w-full max-w-6xl">
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl">
          Why this exists
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          DeepVerify began as a final-year project on verifying political media,
          and became a working study of how far a deepfake detector can actually
          be trusted.
        </p>
      </header>

      <Section title="What it does today">
        <p>
          It detects manipulation in a face in a still image. That is a broader
          problem than political media and a narrower one than "deepfakes" — it
          scores faces, not scenes, not video, not audio.
        </p>
        <p>
          The political specialisation the project set out to build is{" "}
          <strong className="font-semibold text-foreground">not done</strong>.
          Doing it honestly means evaluating on political deepfakes that
          actually circulated, which is a curation and access problem rather
          than a modelling one. That is the next piece of work, and until it is
          finished the product claims only what it has measured.
        </p>
      </Section>

      <Section title="The part that turned out to be interesting">
        <p>
          The obvious question about a detector is "how accurate is it?", and
          the honest answer is that the question is underspecified. Measured on
          one family of manipulations it reaches {percent(best.rocAuc)} ROC-AUC.
          Same model, same code, same seed, a different family:{" "}
          {percent(worst.rocAuc)}.
        </p>
        <p>
          A single headline accuracy figure describes the test set as much as
          the model. So both runs are published, including the unflattering one,
          and the raw output for each is in the repository.
        </p>
      </Section>

      <Section title="Where the model comes from">
        <p>
          The detector is{" "}
          <a
            href="https://huggingface.co/yermandy/deepfake-detection"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand underline underline-offset-2"
          >
            yermandy/deepfake-detection
          </a>
          , a CLIP ViT-L/14 encoder with LN-tuning, trained on FaceForensics++
          by Yermakov et al. and published under MIT. Those weights are used
          unmodified.
        </p>
        <p>
          Built around them here: the face detection and cropping, the inference
          service, the REST API, the benchmark harness, the client, and the
          deployment.
        </p>
      </Section>

      <Section title="Credits">
        <p>
          Built by Francis Okocha-Ojeah, Computer Science, Pan-Atlantic
          University, supervised by Prof. Kingsley Ukaoha.
        </p>
      </Section>

      <div className="mt-16 flex flex-wrap gap-4">
        <Link to="/">
          <Button>Analyse an image</Button>
        </Link>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          <Button variant="secondary">
            Read the source
            <FiArrowUpRight aria-hidden />
          </Button>
        </a>
      </div>
    </div>
  </PageLayout>
);

export default AboutPage;
