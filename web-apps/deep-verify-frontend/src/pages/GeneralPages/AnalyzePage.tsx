import React from "react";

import PageLayout from "../../components/PageLayout";
import MetaTags from "../../components/MetaTags";
import ImageAnalyser from "../../components/ImageAnalyser";

const AnalyzePage: React.FC = () => (
  <PageLayout>
    <MetaTags />
    <div className="mx-auto w-full max-w-6xl">
      <header className="pb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Analyse an image
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          Upload a photo containing a face. You get the likelihood that the face
          was digitally manipulated, the decision threshold behind that call,
          and the benchmark the detector was measured on.
        </p>
      </header>

      <ImageAnalyser />
    </div>
  </PageLayout>
);

export default AnalyzePage;
