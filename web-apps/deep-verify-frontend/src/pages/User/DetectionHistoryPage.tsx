// src/pages/DetectionHistoryPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import PageLoader from "../../components/PageLoader";
import { DetectionHistory } from "./UserDashboard";


const DetectionHistoryPage: React.FC = () => {
  const [detectionHistory, setDetectionHistory] = useState<DetectionHistory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetectionHistory = async () => {
      try {
        const response = await axios.get(
          "https://deep-verify-backend.onrender.com/backend/v1/detection/detection-history"
        );
        setDetectionHistory(response.data);
      } catch (error) {
        console.error("Error fetching detection history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetectionHistory();
  }, []);

  console.log(detectionHistory)

  const handleHistoryItemClick = (id?: string) => {
    navigate(`/detection/${id}`);
  };

  return (
    <DashboardLayout>
      <MetaTags title="Detection History" />
      {loading ? (
        <PageLoader />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-6">
            Detection History
          </h1>

          <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-900">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    File Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Media Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Is Deepfake
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Confidence
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Detected At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-900">
                {detectionHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleHistoryItemClick(item?._id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.mediaType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isDeepfake ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}`}
                      >
                        {item.isDeepfake ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.confidence.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(item.detectedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DetectionHistoryPage;
