import React, { useEffect, useState } from 'react';

const LandingPageSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const calculateOpacity = (elementY: number) => {
    const offset = Math.abs(elementY - scrollY);
    return Math.max(1 - offset / 300, 0);
  };

  const elements = [
    { top: 0, left: -1 },
    { top: 384, left: 63 },
    { top: 96, left: 127 },
    { top: 288, left: 447 },
    { top: 0, left: 415 },
    { top: 64, left: 575 },
  ];

  return (
    <section className="relative overflow-hidden bg-zinc-950">
      <div className="relative z-20 mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
        <div className="relative">
          <span className="relative z-10 mb-4 inline-block rounded-full border border-zinc-700 bg-zinc-900/20 px-3 py-1.5 text-xs text-zinc-50 md:mb-0">
            Exciting announcement 🎉
            <span className="absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-zinc-500/0 via-zinc-300 to-zinc-500/0"></span>
          </span>
        </div>
        <h1 className="mb-3 text-center text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-7xl lg:leading-tight">
          A landing page template that works for you
        </h1>
        <p className="mb-9 max-w-2xl text-center text-base leading-relaxed text-zinc-400 sm:text-lg md:text-lg md:leading-relaxed">
          Build beautiful landing pages for your startups, clients, and side projects, without having to think about design.
        </p>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <button className="rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-zinc-50 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70 flex items-center gap-2">
            Try it free
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
          <button className="transition-all hover:scale-[1.02] hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98] rounded-md px-4 py-2 text-zinc-100">
            Learn more
          </button>
        </div>
      </div>
      {elements.map((element, index) => (
        <div
          key={index}
          className="absolute z-10 h-[64px] w-[1px] bg-gradient-to-b from-blue-500/0 to-blue-500"
          style={{
            top: `${element.top}px`,
            left: `${element.left}px`,
            opacity: calculateOpacity(element.top),
            transform: `translateY(${scrollY}px)`,
          }}
        ></div>
      ))}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' strokeWidth='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
        ></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/0 to-zinc-950"></div>
      </div>
    </section>
  );
};

export default LandingPageSection;
