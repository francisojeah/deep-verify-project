import React from "react";
import { FiShield, FiExternalLink } from "react-icons/fi";

import { Card, CardBody, CardHeader } from "./ui/Card";
import StatusPill from "./ui/StatusPill";
import EmptyState from "./ui/EmptyState";
import Skeleton from "./ui/Skeleton";
import { DetectionResult } from "../lib/mlService";
import { BENCHMARKS, BENCHMARK_SOURCE_URL } from "../lib/benchmark";

interface Props {
  result: DetectionResult | null;
  loading: boolean;
}

const MODEL_CARD_URL =
  import.meta.env.VITE_MODEL_CARD_URL ??
  "https://huggingface.co/yermandy/deepfake-detection";

const percent = (value: number, digits = 1) =>
  `${(value * 100).toFixed(digits)}%`;

const ProbabilityBar: React.FC<{ value: number; manipulated: boolean }> = ({
  value,
  manipulated,
}) => (
  <div className="h-2 w-full overflow-hidden rounded-lg bg-surface-muted">
    <div
      className={`h-full rounded-lg transition-[width] duration-500 ease-brand ${
        manipulated ? "bg-danger" : "bg-success"
      }`}
      style={{ width: `${Math.round(value * 100)}%` }}
    />
  </div>
);

const DetectionResultPanel: React.FC<Props> = ({ result, loading }) => (
  <Card>
    <CardHeader title="Result" icon={<FiShield aria-hidden />} />

    {loading ? (
      <CardBody className="space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardBody>
    ) : !result ? (
      <EmptyState
        icon={<FiShield className="h-5 w-5" aria-hidden />}
        title="No image analysed yet"
        description="Upload an image to see how likely the face is to have been manipulated."
      />
    ) : (
      <CardBody className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <StatusPill tone={result.isDeepfake ? "danger" : "success"}>
            {result.isDeepfake
              ? "Likely manipulated"
              : "No manipulation detected"}
          </StatusPill>
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {percent(result.fakeProbability)}
          </span>
        </div>

        <div>
          <ProbabilityBar
            value={result.fakeProbability}
            manipulated={result.isDeepfake}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Likelihood of manipulation, called at a{" "}
            {percent(result.threshold, 0)} threshold. That threshold is
            uncalibrated, so scores close to it are genuinely uncertain.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-surface-muted px-3 py-2">
            <dt className="text-xs text-muted-foreground">Authentic</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-foreground">
              {percent(result.realProbability)}
            </dd>
          </div>
          <div className="rounded-lg bg-surface-muted px-3 py-2">
            <dt className="text-xs text-muted-foreground">
              Face detected with
            </dt>
            <dd className="mt-0.5 font-medium tabular-nums text-foreground">
              {result.faceConfidence !== null
                ? percent(result.faceConfidence)
                : "-"}
            </dd>
          </div>
        </dl>

        {BENCHMARKS.length > 0 && (
          <div className="rounded-lg bg-surface-muted px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Measured on
            </p>
            <ul className="mt-2 space-y-1.5">
              {BENCHMARKS.map((run) => (
                <li key={run.dataset} className="text-sm text-foreground">
                  <span className="font-medium tabular-nums">
                    {percent(run.rocAuc)} ROC-AUC
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    on {run.dataset}, {run.images.toLocaleString()} images
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={BENCHMARK_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand underline underline-offset-2"
            >
              Raw benchmark output
              <FiExternalLink aria-hidden />
            </a>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          One signal, not proof. Scored by{" "}
          <a
            href={MODEL_CARD_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            yermandy/deepfake-detection
          </a>
          , a CLIP ViT-L/14 detector published under MIT.
        </p>
      </CardBody>
    )}
  </Card>
);

export default DetectionResultPanel;
