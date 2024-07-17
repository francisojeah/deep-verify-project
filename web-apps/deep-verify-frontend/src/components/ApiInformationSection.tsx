import React from 'react';

const APIInformationSection: React.FC = () => {
  return (
    <section className="py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Deep-Verify API</h2>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          Integrate Deep-Verify's deepfake detection capabilities into your own applications with our powerful API.
        </p>
        <div className="mt-8 flex flex-col items-center sm:flex-row justify-center gap-6">
          <button className="rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-zinc-50 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 flex items-center gap-2">
            View API Documentation
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h3 className="text-xl font-bold">Audio Detection Endpoint</h3>
            <p className="mt-2 text-zinc-400">Detect deepfakes in audio files. Supports various audio formats and returns a confidence score.</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h3 className="text-xl font-bold">Image Detection Endpoint</h3>
            <p className="mt-2 text-zinc-400">Analyze images to identify deepfakes. Supports multiple image formats and provides detailed analysis.</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h3 className="text-xl font-bold">Video Detection Endpoint</h3>
            <p className="mt-2 text-zinc-400">Verify the authenticity of video content. Supports various video formats and delivers comprehensive results.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default APIInformationSection;
