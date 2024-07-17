import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import { BsCloudArrowUp } from "react-icons/bs";
import ConditionalRoute from "../../routes/ConditionalRoute";
import { Role, UserStateProps } from "../../store/interfaces/user.interface";
import { RootState } from "../../store/store";
import PageLoader from "../../components/PageLoader";
import DashboardLayout from "../../components/DashboardLayout";
import MetaTags from "../../components/MetaTags";
import { IoClose } from "react-icons/io5";
export interface DetectionHistory {
  _id?: string;
  id?: string;
  fileName: string;
  mediaType: string;
  isDeepfake: boolean;
  confidence: number;
  detectedAt: string;
}

const mediaTypes = ['image', 'audio', 'video'] as const;
type MediaType = typeof mediaTypes[number];

const UserDashboard: React.FC = () => {
  const userSlice = useSelector<RootState, UserStateProps>((state) => state.user);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [detectionHistory, setDetectionHistory] = useState<DetectionHistory[]>([]);
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('image');

  useEffect(() => {
    const fetchDetectionHistory = async () => {
      try {
        const response = await axios.get('https://deep-verify-backend.onrender.com/backend/v1/detection/detection-history');
        setDetectionHistory(response.data || []);
      } catch (error) {
        console.error('Error fetching detection history:', error);
      }
    };

    fetchDetectionHistory();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];
    setFile(acceptedFile);

    if (acceptedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(acceptedFile);
    } else if (acceptedFile.type.startsWith('video/')) {
      setPreview(URL.createObjectURL(acceptedFile));
    } else if (acceptedFile.type.startsWith('audio/')) {
      setPreview(URL.createObjectURL(acceptedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': activeMediaType === 'image' ? [] : [],
      'audio/*': activeMediaType === 'audio' ? [] : [],
      'video/*': activeMediaType === 'video' ? [] : [],
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

     try {
      const response = await axios.post(`https://deep-verify-backend.onrender.com/backend/v1/detection/detect/${activeMediaType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/detection/${response.data._id}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
    setPreview(null);
  };

  const handleHistoryItemClick = (id?: string) => {
    navigate(`/detection/${id}`);
  };

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={
        userSlice.user &&
        userSlice.user.isVerified &&
        userSlice.isAuthenticated &&
        (userSlice.user.roles.includes(Role.User) ||
          userSlice.user.roles.includes(Role.Admin))
        ? true
        : false
      }
    >
      <DashboardLayout>
        <>
          <MetaTags />
          {userSlice?.isLoading ? (
            <PageLoader />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pb-8">
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Hi, {userSlice.user?.firstname} 👋
                </h1>
                <p className="mt-2 text-sm text-black dark:text-white opacity-70">
                  Welcome to your Deepfake Detection Dashboard. What would you like to analyze today?
                </p>
              </div>

              <div className="border border-neutral-300 dark:border-neutral-500 p-4 overflow-hidden shadow rounded-3xl divide-y divide-gray-200 dark:divide-gray-900">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-center md:gap-8 mb-4">
                    {mediaTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveMediaType(type)}
                        className={`px-4 py-2 md:w-52 rounded-lg mr-2 ${
                          activeMediaType === type
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-900 text-black dark:text-white'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {preview ? (
                            <div className="relative">
                              {activeMediaType === 'image' && (
                                <img src={preview} alt="Preview" className="mx-auto h-32 w-auto" />
                              )}
                              {activeMediaType === 'video' && (
                                <video src={preview} className="mx-auto h-32 w-auto" controls />
                              )}
                              {activeMediaType === 'audio' && (
                                <audio src={preview} className="mx-auto w-full" controls />
                              )}
                              <button
                                type="button"
                                onClick={handleCancelUpload}
                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <IoClose className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <BsCloudArrowUp className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                              <div className="flex flex-col sm:flex-row items-center text-sm text-black dark:text-white opacity-70">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>{isDragActive ? `Drop the ${activeMediaType} here` : `Upload ${activeMediaType}`}</span>
                                  <input {...getInputProps()} id="file-upload" name="file-upload" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-black dark:text-white opacity-70">
                                {activeMediaType === 'image' && 'PNG, JPG, GIF up to 10MB'}
                                {activeMediaType === 'audio' && 'MP3, WAV up to 10MB'}
                                {activeMediaType === 'video' && 'MP4, AVI up to 50MB'}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={!file || loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-custom-primary hover:bg-medium-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          (!file || loading) && 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {loading ? 'Detecting...' : 'Detect Deepfake'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-medium text-black dark:text-white">Detection History</h2>
                <div className="mt-4 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-900">
                          <thead className="">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black dark:text-white sm:pl-6">File Name</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Media Type</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Is Deepfake</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Confidence</th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Detected At</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-900">
                            {detectionHistory.map((item) => (
                              <tr key={item.id} onClick={() => handleHistoryItemClick(item?._id)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black dark:text-white sm:pl-6">{item.fileName}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-black dark:text-white opacity-70">{item.mediaType}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-black dark:text-white opacity-70">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isDeepfake ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                    {item.isDeepfake ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-black dark:text-white opacity-70">{item.confidence.toFixed(2)}%</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-black dark:text-white opacity-70">{new Date(item.detectedAt).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </DashboardLayout>
    </ConditionalRoute>
  );
};

export default UserDashboard;