import { Helmet } from "react-helmet-async";

type MetaTagsProps = {
  title?: string;
  description?: string;
  keywords?: string;
  pageUrl?: string;
};

const MetaTags = ({
  title = "DeepVerify | Political Media Deepfake Detection",
  keywords = "DeepVerify, Deepfake Detection, Political Media, AI, Machine Learning, Media Authentication, Image Analysis, Video Analysis, Political Images, Political Videos",
  description = "DeepVerify specializes in detecting deepfakes in political media. Leverage our cutting-edge technology to analyze images and videos for authenticity and uncover potential manipulations in political content.",
  pageUrl = window.location.href
}: MetaTagsProps) => {
  const imageUrl = `/assets/icons/logo.png`;

  return (
    <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href={imageUrl} />
      <link rel="canonical" href={pageUrl} />
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="DeepVerify" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default MetaTags;
