import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiClock } from "react-icons/fi";

import ConditionalRoute from "../../routes/ConditionalRoute";
import { Role, UserStateProps } from "../../store/interfaces/user.interface";
import { RootState } from "../../store/store";
import PageLoader from "../../components/PageLoader";
import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import StatusPill from "../../components/ui/StatusPill";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import ImageAnalyser from "../../components/ImageAnalyser";
import { api } from "../../lib/api";

export interface DetectionHistory {
  _id?: string;
  fileName: string;
  mediaType: string;
  isDeepfake: boolean;
  fakeProbability: number;
  detectedAt: string;
}

const UserDashboard: React.FC = () => {
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

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

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={Boolean(
        userSlice.user &&
          userSlice.user.isVerified &&
          userSlice.isAuthenticated &&
          (userSlice.user.roles.includes(Role.User) ||
            userSlice.user.roles.includes(Role.Admin)),
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
                  Upload a photo containing a face and the detector will score
                  how likely it is to have been manipulated.
                </p>
              </header>

              <ImageAnalyser />

              <Card className="mt-6">
                <CardHeader
                  title="Recent detections"
                  icon={<FiClock aria-hidden />}
                />
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
                          <th className="px-5 py-3 font-medium">Manipulated</th>
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
                              <StatusPill
                                tone={item.isDeepfake ? "danger" : "success"}
                              >
                                {item.isDeepfake ? "Manipulated" : "Authentic"}
                              </StatusPill>
                            </td>
                            <td className="px-5 py-3 tabular-nums text-muted-foreground">
                              {(item.fakeProbability * 100).toFixed(1)}%
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
