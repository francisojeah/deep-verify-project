import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiAlertCircle, FiClock, FiFile, FiShield } from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import Button from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import StatusPill from "../../components/ui/StatusPill";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import Alert from "../../components/ui/Alert";
import { api, errorMessage } from "../../lib/api";

interface DetectionDetails {
  _id: string;
  fileName: string;
  mediaType: string;
  isDeepfake: boolean;
  confidence: number;
  detectedAt: string;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="rounded-lg border border-border px-4 py-3">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="mt-1 truncate text-sm font-medium text-foreground">{children}</dd>
  </div>
);

const DetectionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<DetectionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<DetectionDetails>(`/detection/detection/${id}`)
      .then(({ data }) => active && setDetails(data))
      .catch((caught) => active && setError(errorMessage(caught, "Could not load this detection.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const probability = details ? details.confidence / 100 : 0;

  return (
    <DashboardLayout>
      <MetaTags />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="pb-6">
          <h1 className="text-2xl font-semibold text-foreground">Detection record</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A stored result from a previous analysis.
          </p>
        </header>

        {loading ? (
          <Card>
            <CardBody className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardBody>
          </Card>
        ) : error || !details ? (
          <Card>
            <EmptyState
              icon={<FiAlertCircle className="h-5 w-5" aria-hidden />}
              title="Detection not found"
              description={error ?? "This record does not exist or is no longer available."}
              action={
                <Link to="/dashboard">
                  <Button variant="secondary">Back to dashboard</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Analysis result" icon={<FiShield aria-hidden />} />
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <StatusPill tone={details.isDeepfake ? "danger" : "success"}>
                    {details.isDeepfake ? "Likely manipulated" : "No manipulation detected"}
                  </StatusPill>
                  <span className="text-2xl font-semibold tabular-nums text-foreground">
                    {probability.toFixed(4)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-lg bg-surface-muted">
                  <div
                    className={`h-full rounded-lg ${
                      details.isDeepfake ? "bg-danger" : "bg-success"
                    }`}
                    style={{ width: `${Math.round(probability * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  p(manipulated) from the pre-trained yermandy/deepfake-detection model.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="File" icon={<FiFile aria-hidden />} />
              <CardBody>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="File name">{details.fileName}</Field>
                  <Field label="Media type">{details.mediaType}</Field>
                  <Field label="Analysed at">
                    <span className="inline-flex items-center gap-1.5">
                      <FiClock className="text-muted-foreground" aria-hidden />
                      {new Date(details.detectedAt).toLocaleString()}
                    </span>
                  </Field>
                </dl>
              </CardBody>
            </Card>

            <Alert tone="neutral">
              Uploaded images are not retained after analysis, so the original media
              cannot be shown here.
            </Alert>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DetectionDetailsPage;
