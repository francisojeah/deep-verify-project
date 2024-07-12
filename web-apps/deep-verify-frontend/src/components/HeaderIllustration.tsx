
interface HeaderIllustrationProps {
  text: string;
}

const HeaderIllustration = ({ text }: HeaderIllustrationProps) => {
  return (
    <div className="relative flex items-center justify-center w-full mb-10 text-center transition-colors bg-white text-black dark:bg-black dark:text-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex w-full md:w-1/2 items-center justify-center">
          <div className="h-[2px] rounded-full flex-1 bg-gradient-to-l from-custom-primary to-transparent dark:from-custom-primary"></div>
          <h1 className="relative z-10 mx-4 text-xs uppercase text-custom-primary font-bold">{text}</h1>
          <div className="h-[2px] rounded-full flex-1 bg-gradient-to-r from-custom-primary to-transparent dark:from-custom-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderIllustration;
