import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import PageLoader from "../../components/PageLoader";

interface DetectionDetails {
  id: string;
  fileName: string;
  mediaType: string;
  isDeepfake: boolean;
  confidence: number;
  detectedAt: string;
}

const DetectionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detectionDetails, setDetectionDetails] =
    useState<DetectionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetectionDetails = async () => {
      try {
        const response = await axios.get(`https://deep-verify-backend.onrender.com/backend/v1/detection/detection/${id}`);
        setDetectionDetails(response.data);
      } catch (error) {
        console.error("Error fetching detection details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetectionDetails();
  }, [id]);


  return (
    <DashboardLayout>
      <>
        <MetaTags />
        {loading ? (
          <PageLoader />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-6">
              Detection Details
            </h1>
            <div className=" border border-neutral-300 dark:border-neutral-500 shadow overflow-hidden rounded-2xl">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-black dark:text-white">
                  File Information
                </h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200 dark:divide-gray-700">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-black dark:text-white opacity-70">
                      File name
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-white sm:mt-0 sm:col-span-2">
                      {detectionDetails?.fileName}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-black dark:text-white opacity-70">
                      Media type
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-white sm:mt-0 sm:col-span-2">
                      {detectionDetails?.mediaType}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-black dark:text-white opacity-70">
                      Is Deepfake
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-white sm:mt-0 sm:col-span-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${detectionDetails?.isDeepfake ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}`}
                      >
                        {detectionDetails?.isDeepfake ? "Yes" : "No"}
                      </span>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-black dark:text-white opacity-70">
                      Confidence
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-white sm:mt-0 sm:col-span-2">
                      {detectionDetails?.confidence.toFixed(2)}%
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-black dark:text-white opacity-70">
                      Detected At
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-white sm:mt-0 sm:col-span-2">
                      {new Date(detectionDetails?.detectedAt|| "").toLocaleString()}
                    </dd>
                  </div>
                  {/* Add any additional details you want to display */}
                </dl>
              </div>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
};

export default DetectionDetailsPage;
