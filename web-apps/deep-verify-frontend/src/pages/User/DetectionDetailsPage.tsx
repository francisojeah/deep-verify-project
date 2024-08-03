import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaFile,
  FaPhotoVideo,
  FaClock,
  FaShieldAlt,
  FaChartBar,
} from "react-icons/fa";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import PageLoader from "../../components/PageLoader";
import { useDispatch, useSelector } from "react-redux";
import { UserStateProps } from "../../store/interfaces/user.interface";
import { RootState } from "../../store/store";
import DoughnutChart from "../../components/DoughnutChart";

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
  const [mediaPreview, setMediaPreview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user
  );

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
    return () => {
      setMediaPreview(userSlice?.mediaPreview);
      // dispatch(clearMediaPreview());
    };
  }, [id, dispatch]);

  const renderMediaPreview = () => {
    if (!mediaPreview) return null;

    const borderColor = detectionDetails?.isDeepfake
      ? "border-red-500"
      : "border-green-500";

    if (mediaPreview?.type?.startsWith("image")) {
      return (
        <div
          className={`relative w-fit border-4 ${borderColor} rounded-lg overflow-hidden`}
        >
          <img
            src={"https://jgrj.law.uiowa.edu/sites/jgrj.law.uiowa.edu/files/styles/large/public/2023-04/Picture1.jpg?itok=kQ2_URLi"}
            alt="Analyzed media"
            // className="w-full h-auto"
          />
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-2 font-bold">
            {detectionDetails?.isDeepfake
              ? "Potential Deepfake Detected"
              : "No Evidence of Manipulation"}
          </div>
        </div>
      );
    // } else if (mediaPreview?.type?.startsWith("video")) {
    }else if(true){

      return (
        <div
          className={`relative border-4 ${borderColor} rounded-lg overflow-hidden`}
        >
          <video controls className="w-full h-auto">
            <source
              src={URL.createObjectURL(mediaPreview)}
              type={mediaPreview.type}
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-2 font-bold">
            {detectionDetails?.isDeepfake
              ? "Potential Manipulation Identified"
              : "No Evidence of Manipulation"}
          </div>
        </div>
      );
    }

    return null;
  };

 

  if (loading) return <PageLoader />;

  return (
    <DashboardLayout>
      <MetaTags />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Detection Results
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mediaPreview && (
            <div className="md:col-span-1">
              <div className="flex flex-col items-center border border-neutral-300 dark:border-neutral-500 rounded-xl shadow-lg overflow-hidden p-6">
                <h2 className="flex items-start text-start text-xl w-full font-semibold text-gray-900 dark:text-white mb-4">
                  Media Preview
                </h2>
                {renderMediaPreview()}
              </div>
            </div>
          )}

          <div
            className={
              mediaPreview ? "md:col-span-1 space-y-14" : "md:col-span-2"
            }
          >
            <div className="border border-neutral-300 dark:border-neutral-500 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaFile className="mr-3 text-custom-primary" />
                  File Information
                </h2>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                  <div className="border border-neutral-300 dark:border-neutral-500 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                      File name
                    </dt>
                    <dd className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {detectionDetails?.fileName}
                    </dd>
                  </div>
                  <div className="border border-neutral-300 dark:border-neutral-500 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                      Media type
                    </dt>
                    <dd className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                      <FaPhotoVideo className="mr-2 text-custom-primary" />
                      {detectionDetails?.mediaType}
                    </dd>
                  </div>
                  <div className="border border-neutral-300 dark:border-neutral-500 p-4 rounded-lg sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                      Detected At
                    </dt>
                    <dd className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                      <FaClock className="mr-2 text-custom-primary" />
                      {new Date(
                        detectionDetails?.detectedAt || ""
                      ).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="border border-neutral-300 dark:border-neutral-500 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaShieldAlt className="mr-3 text-custom-primary" />
                  Analysis Results
                </h2>
                <div className="flex  w-full gap-10">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deepfake Detection
                    </p>
                    <div className="mt-1 flex items-center">
                      <span
                        className={`px-4 py-2 text-base font-bold rounded-full ${
                          detectionDetails?.isDeepfake
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {detectionDetails?.isDeepfake
                          ? "Deepfake Detected"
                          : "No Deepfake Detected"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FaChartBar className="mr-2 text-custom-primary" />
                        Confidence
                      </p>
                      <p className="mt-2 py-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {detectionDetails?.confidence.toFixed(2)}%
                      </p>
                    </div>
                    {detectionDetails?.confidence && (
                      <DoughnutChart
                        percentage={parseFloat(
                          detectionDetails.confidence.toFixed(2)
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DetectionDetailsPage;
