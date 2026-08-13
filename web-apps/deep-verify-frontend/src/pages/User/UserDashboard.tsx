import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { BsCloudArrowUp } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FiClock, FiExternalLink } from "react-icons/fi";

import ConditionalRoute from "../../routes/ConditionalRoute";
import { Role, UserStateProps } from "../../store/interfaces/user.interface";
import { RootState } from "../../store/store";
import PageLoader from "../../components/PageLoader";
import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import Button from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import StatusPill from "../../components/ui/StatusPill";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";
import Skeleton from "../../components/ui/Skeleton";
import DetectionResultPanel from "../../components/DetectionResultPanel";
import { api, errorMessage } from "../../lib/api";
import {
  DetectionResult,
  NoFaceDetectedError,
  detectImage,
} from "../../lib/mlService";

export interface DetectionHistory {
  _id?: string;
  fileName: string;
  mediaType: string;
  isDeepfake: boolean;
  confidence: number;
  detectedAt: string;
}

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] };

const UserDashboard: React.FC = () => {
  const userSlice = useSelector<RootState, UserStateProps>((state) => state.user);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);

  const [history, setHistory] = useState<DetectionHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<DetectionHistory[]>("/detection/detection-history")
      .then(({ data }) => active && setHistory(data ?? []))
      .catch(() => active && setHistory([]))
      .finally(() => active && setHistoryLoading(false));
    return () => {
      active = false;
    };
  }, []);

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
        `That image is ${(next.size / 1024 / 1024).toFixed(1)}MB. The limit is 10MB.`
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
      setResult(await detectImage(file));
    } catch (caught) {
      setError(
        caught instanceof NoFaceDetectedError
          ? "No face found in that image. This model only scores face crops, so it returns nothing rather than guess."
          : errorMessage(caught, "Detection failed. The service may be waking up - try again.")
      );
    } finally {
      setAnalysing(false);
    }
  };

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={Boolean(
        userSlice.user &&
          userSlice.user.isVerified &&
          userSlice.isAuthenticated &&
          (userSlice.user.roles.includes(Role.User) ||
            userSlice.user.roles.includes(Role.Admin))
      )}
    >
      <DashboardLayout>
        <>
          <MetaTags />
          {userSlice?.isLoading ? (
            <PageLoader />
          ) : (
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <header className="pb-6">
                <h1 className="text-2xl font-semibold text-foreground">
                  Hi, {userSlice.user?.firstname}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a photo containing a face and the detector will score how
                  likely it is to have been manipulated.
                </p>
              </header>

              <Alert tone="brand" className="mb-6">
                Scored by{" "}
                <a
                  href={
                    import.meta.env.VITE_MODEL_CARD_URL ??
                    "https://huggingface.co/yermandy/deepfake-detection"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                >
                  yermandy/deepfake-detection
                  <FiExternalLink aria-hidden />
                </a>
                , a pre-trained CLIP ViT-L/14 detector trained on FaceForensics++ by
                its authors. This project did not train the model. Images only.
              </Alert>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader
                    title="Analyse an image"
                    description="JPG or PNG, up to 10MB, with a visible face."
                  />
                  <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {preview ? (
                        <div className="relative overflow-hidden rounded-lg border border-border">
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
                          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
                            isDragActive
                              ? "border-brand bg-brand-subtle"
                              : "border-border-strong hover:border-brand hover:bg-surface-muted"
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

              <Card className="mt-6">
                <CardHeader title="Recent detections" icon={<FiClock aria-hidden />} />
                {historyLoading ? (
                  <CardBody className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <Skeleton key={i} className="h-11 w-full" />
                    ))}
                  </CardBody>
                ) : history.length === 0 ? (
                  <EmptyState
                    icon={<FiClock className="h-5 w-5" aria-hidden />}
                    title="No detections yet"
                    description="Analysed images are saved here once the API layer is connected."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                          <th className="px-5 py-3 font-medium">File</th>
                          <th className="px-5 py-3 font-medium">Verdict</th>
                          <th className="px-5 py-3 font-medium">p(manipulated)</th>
                          <th className="px-5 py-3 font-medium">When</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {history.map((item) => (
                          <tr key={item._id} className="hover:bg-surface-muted">
                            <td className="max-w-[16rem] truncate px-5 py-3 font-medium text-foreground">
                              {item.fileName}
                            </td>
                            <td className="px-5 py-3">
                              <StatusPill tone={item.isDeepfake ? "danger" : "success"}>
                                {item.isDeepfake ? "Manipulated" : "Authentic"}
                              </StatusPill>
                            </td>
                            <td className="px-5 py-3 tabular-nums text-muted-foreground">
                              {(item.confidence / 100).toFixed(4)}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground">
                              {new Date(item.detectedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}
        </>
      </DashboardLayout>
    </ConditionalRoute>
  );
};

export default UserDashboard;
