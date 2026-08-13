/**
 * Measured benchmark results.
 *
 * Every value here is copied verbatim from a committed run in
 * web-apps/deep-verify-model-microservice/benchmarks/results/. If a run has not
 * happened, the entry stays absent and the UI says so. Nothing here is estimated.
 */

export interface BenchmarkRun {
  dataset: string;
  images: number;
  rocAuc: number;
  prAuc: number;
  f1: number;
  note: string;
}

export const BENCHMARKS: BenchmarkRun[] = [];

export const BENCHMARK_SOURCE_URL =
  "https://github.com/francisojeah/deep-verify-project/tree/main/web-apps/deep-verify-model-microservice/benchmarks/results";
