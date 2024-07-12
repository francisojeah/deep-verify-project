const DesktopScreen = () => {
  return (
    <div className="py-16 flex mx-auto px-4 sm:px-6 lg:px-8 justify-center items-center w-full">
    <figure className="relative z-[1] max-w-full w-[50rem] h-auto rounded-b-lg shadow-[0_2.75rem_3.5rem_-2rem_rgb(139_92_246_/_50%),_0_0_5rem_-2rem_rgb(139_92_246_/_30%)] dark:shadow-[0_2.75rem_3.5rem_-2rem_rgb(139_92_246_/_50%),_0_0_5rem_-2rem_rgb(139_92_246_/_30%)]">
      <div className="relative flex items-center max-w-[50rem] bg-gray-100 rounded-t-lg py-2 px-24 dark:bg-gray-800">
        <div className="flex space-x-1 absolute top-2/4 left-4 -translate-y-1/2">
          <span className="size-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
          <span className="size-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
          <span className="size-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
        </div>
        <div className="flex justify-center items-center size-full text-gray-500 dark:text-gray-400 dark:bg-gray-700 bg-gray-200 rounded-lg text-[.5rem]">
          www.deepverify.com
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-b-lg">
        <img
          className="max-w-full dark:hidden h-auto rounded-b-lg"
          src="/assets/images/desktop-white.png"
          alt="Image Description"
        />
        <img
          className="max-w-full hidden dark:flex h-auto rounded-b-lg"
          src="/assets/images/desktop.png"
          alt="Image Description"
        />
      </div>
    </figure>
    </div>
  );
};

export default DesktopScreen;
