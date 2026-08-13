#!/usr/bin/env node
/**
 * Regenerate the frontend's benchmark constants from committed benchmark runs.
 *
 * The frontend must never carry a hand-typed metric. Run this after any
 * benchmark and commit the result:
 *
 *   node scripts/sync-benchmarks.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  root,
  "web-apps/deep-verify-model-microservice/benchmarks/results/latest.json",
);
const target = resolve(
  root,
  "web-apps/deep-verify-frontend/src/lib/benchmark.ts",
);

const runs = existsSync(source)
  ? JSON.parse(readFileSync(source, "utf8")).runs
  : [];

const entries = runs.map((run) => ({
  dataset: run.dataset_name,
  images: run.n_images,
  rocAuc: Number(run.metrics.roc_auc.toFixed(4)),
  prAuc: Number(run.metrics.pr_auc.toFixed(4)),
  f1: Number(run.metrics.f1_at_default.toFixed(4)),
  note: run.manipulation_family,
}));

const banner = `/**
 * GENERATED FILE - do not edit by hand.
 *
 * Produced by scripts/sync-benchmarks.mjs from the committed benchmark runs in
 * web-apps/deep-verify-model-microservice/benchmarks/results/. Every number here
 * traces to a run that is in the repository. Nothing is estimated.
 */`;

writeFileSync(
  target,
  `${banner}

export interface BenchmarkRun {
  dataset: string;
  images: number;
  rocAuc: number;
  prAuc: number;
  f1: number;
  note: string;
}

export const BENCHMARKS: BenchmarkRun[] = ${JSON.stringify(entries, null, 2)};

export const BENCHMARK_SOURCE_URL =
  "https://github.com/francisojeah/deep-verify-project/tree/main/web-apps/deep-verify-model-microservice/benchmarks/results";
`,
);

console.log(`Wrote ${entries.length} benchmark run(s) to ${target}`);
