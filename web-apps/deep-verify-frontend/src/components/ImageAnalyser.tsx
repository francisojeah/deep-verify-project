import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsCloudArrowUp } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

import Button from "./ui/Button";
import { Card, CardBody, CardHeader } from "./ui/Card";
import Alert from "./ui/Alert";
import DetectionResultPanel from "./DetectionResultPanel";
import {
  DetectionResult,
  NoFaceDetectedError,
  detectImage,
} from "../lib/mlService";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] };

interface Props {
  onAnalysed?: (result: DetectionResult, file: File) => void;
}

/** Upload, analyse and result, shared by the public page and the dashboard. */
const ImageAnalyser: React.FC<Props> = ({ onAnalysed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onDrop = useCallback((accepted: File[], rejected: unknown[]) => {
    setResult(null);
    setError(null);

    if (rejected.length) {
      setError("That file type is not supported. Upload a JPG or PNG.");
      return;
    }
    const next = accepted[0];
    if (!next) return;
    if (next.size > MAX_BYTES) {
      setError(
        `That image is ${(next.size / 1024 / 1024).toFixed(1)}MB. The limit is 10MB.`,
      );
      return;
    }
    setFile(next);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    multiple: false,
  });

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setAnalysing(true);
    setError(null);
    setResult(null);
    try {
      const next = await detectImage(file);
      setResult(next);
      onAnalysed?.(next, file);
    } catch (caught) {
      setError(
        caught instanceof NoFaceDetectedError
          ? "No face found in that image. The model scores face crops, so it returns nothing rather than guess."
          : "Detection failed. The service may be waking up - try again in a moment.",
      );
    } finally {
      setAnalysing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader
          title="Analyse an image"
          description="JPG or PNG, up to 10MB, with a visible face."
        />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {preview ? (
              <div className="relative overflow-hidden rounded-lg bg-surface-muted">
                <img
                  src={preview}
                  alt="Selected upload"
                  className="mx-auto max-h-72 w-auto"
                />
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 rounded-lg bg-foreground/70 p-1.5 text-background transition-colors hover:bg-foreground"
                >
                  <IoClose className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg px-6 py-14 text-center transition-colors ${
                  isDragActive
                    ? "bg-brand-subtle"
                    : "bg-surface-muted hover:bg-border"
                }`}
              >
                <input {...getInputProps()} />
                <BsCloudArrowUp
                  className="h-9 w-9 text-muted-foreground"
                  aria-hidden
                />
                <p className="mt-3 text-sm font-medium text-foreground">
                  {isDragActive ? "Drop it here" : "Drop an image or browse"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG or PNG, up to 10MB
                </p>
              </div>
            )}

            {error && <Alert tone="danger">{error}</Alert>}

            <Button
              type="submit"
              size="lg"
              loading={analysing}
              disabled={!file}
              className="w-full"
            >
              {analysing ? "Analysing" : "Analyse image"}
            </Button>
          </form>
        </CardBody>
      </Card>

      <DetectionResultPanel result={result} loading={analysing} />
    </div>
  );
};

export default ImageAnalyser;
