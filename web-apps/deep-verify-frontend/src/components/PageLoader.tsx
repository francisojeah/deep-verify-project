const PageLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-[100vh] overflow-hidden">
      <div role="status">
        <img
          src="/assets/icons/logo.svg"
          alt="Logo"
          className="w-16 h-16 animate-pulse"
        />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default PageLoader;
