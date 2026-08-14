import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const onClickGoHome = () => {
    navigate("/home", {
      replace: true,
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen p-4 justify-center items-center">
      <div className="w-full md:w-1/2 mx-auto lg:p-16 lg:mt-10 flex flex-col gap-8 justify-center items-center">
        <p className="lg:mt-8 lg:text-2xl text-black dark:text-white text-secondary font-bold text-center">
          This page does not exist
        </p>

        <img
          className="w-1/2 h-1/2"
          src="/assets/images/error404.svg"
          alt="error404"
        />

        <div className="w-full flex justify-between gap-5 mt-4">
          <button
            className="w-1/2 rounded-xl min-h-[48px] text-white bg-brand text-base font-medium hover:bg-transparent hover:text-brand focus:outline-none"
            onClick={handleGoBack}
          >
            Go back
          </button>
          <button
            className="w-1/2 rounded-xl bg-transparent min-h-[48px] text-brand text-base font-medium hover:bg-brand hover:text-white  focus:outline-none"
            onClick={onClickGoHome}
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
