/**
 * GENERATED FILE - do not edit by hand.
 *
 * Produced by scripts/sync-benchmarks.mjs from the committed benchmark runs in
 * web-apps/deep-verify-model-microservice/benchmarks/results/. Every number here
 * traces to a run that is in the repository. Nothing is estimated.
 */

export interface BenchmarkRun {
  dataset: string;
  images: number;
  rocAuc: number;
  prAuc: number;
  f1: number;
  note: string;
}

export const BENCHMARKS: BenchmarkRun[] = [
  {
    "dataset": "FakeAVCeleb (community mirror)",
    "images": 2210,
    "rocAuc": 0.9244,
    "prAuc": 0.942,
    "f1": 0.8382,
    "note": "lip-sync (Wav2Lip) and face-swap, on VoxCeleb2 sources"
  }
];

export const BENCHMARK_SOURCE_URL =
  "https://github.com/francisojeah/deep-verify-project/tree/main/web-apps/deep-verify-model-microservice/benchmarks/results";
