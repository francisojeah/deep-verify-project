import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import Button from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import StatusPill from "../../components/ui/StatusPill";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import Alert from "../../components/ui/Alert";
import { api, errorMessage } from "../../lib/api";
import { DetectionHistory } from "./UserDashboard";

const columns = ["File", "Verdict", "p(manipulated)", "Analysed"];

const DetectionHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<DetectionHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api
      .get<DetectionHistory[]>("/detection/detection-history")
      .then(({ data }) => active && setHistory(data ?? []))
      .catch((caught) => active && setError(errorMessage(caught, "Could not load history.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <MetaTags title="Detection History" />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="pb-6">
          <h1 className="text-2xl font-semibold text-foreground">Detection history</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every image you have analysed, most recent first.
          </p>
        </header>

        {error && (
          <Alert tone="danger" className="mb-6">
            {error}
          </Alert>
        )}

        <Card>
          {loading ? (
            <CardBody className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-11 w-full" />
              ))}
            </CardBody>
          ) : history.length === 0 ? (
            <EmptyState
              icon={<FiClock className="h-5 w-5" aria-hidden />}
              title="Nothing analysed yet"
              description="Results appear here once you analyse an image."
              action={
                <Link to="/dashboard">
                  <Button>Analyse an image</Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    {columns.map((column) => (
                      <th key={column} className="px-5 py-3 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => navigate(`/detection/${item._id}`)}
                      className="cursor-pointer hover:bg-surface-muted"
                    >
                      <td className="max-w-[18rem] truncate px-5 py-3 font-medium text-foreground">
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
    </DashboardLayout>
  );
};

export default DetectionHistoryPage;
