const CloseIcon = () => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_38_2711)">
        <mask
          id="mask0_38_2711"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="30"
          height="30"
        >
          <path d="M30 0H0V30H30V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_38_2711)">
          <path
            d="M8.75 8.75012L21.25 21.2502M8.75 21.2502L21.25 8.75012"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_38_2711">
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CloseIcon;
