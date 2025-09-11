import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <svg height={0} width={0} viewBox="0 0 100 100" className="absolute">
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2={2}
              x2={0}
              y1={62}
              x1={0}
              id="b"
            >
              <stop stopColor="#8B5CF6" />
              <stop stopColor="#A855F7" offset="0.5" />
              <stop stopColor="#EC4899" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2={0}
              x2={0}
              y1={64}
              x1={0}
              id="c"
            >
              <stop stopColor="#8B5CF6" />
              <stop stopColor="#A855F7" offset="0.5" />
              <stop stopColor="#EC4899" offset="1" />
              <animateTransform
                repeatCount="indefinite"
                keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                keyTimes="0;0.25;0.5;0.75;1"
                dur="8s"
                values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32"
                type="rotate"
                attributeName="gradientTransform"
              />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2={2}
              x2={0}
              y1={62}
              x1={0}
              id="d"
            >
              <stop stopColor="#EC4899" />
              <stop stopColor="#A855F7" offset="0.5" />
              <stop stopColor="#8B5CF6" offset="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* S */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 100 100"
          className="letter"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={10}
            stroke="url(#b)"
            d="M 75,35 
              C 75,25 65,15 50,15
              C 35,15 25,25 25,35
              C 25,45 35,50 50,50
              C 65,50 75,55 75,65
              C 75,75 65,85 50,85
              C 35,85 25,75 25,65"
            className="dash"
            pathLength={360}
          />
        </svg>

        {/* T */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="letter">
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={10}
            stroke="url(#c)"
            d="M20,20 H80 M50,20 V80"
            className="dash"
            pathLength={360}
          />
        </svg>

        {/* A */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="letter">
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={10}
            stroke="url(#d)"
            d="M20,80 L50,20 L80,80 M35,55 H65"
            className="dash"
            pathLength={360}
          />
        </svg>

        {/* N */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="letter">
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={10}
            stroke="url(#c)"
            d="M20,80 V20 L80,80 V20"
            className="dash"
            pathLength={360}
          />
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .absolute {
    position: absolute;
  }

  .inline-block {
    display: inline-block;
  }

 
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
  }
 
 

  .dash {
    animation: dashArray 2s ease-in-out infinite, dashOffset 2s linear infinite;
  }

  // .spin {
  //   animation: spinDashArray 2s ease-in-out infinite, spin 8s ease-in-out infinite,
  //     dashOffset 2s linear infinite;
  //   transform-origin: center;
  // }

    /* Responsive sizing for different screen sizes */
  @media (max-width: 768px) {
    .loader svg {
      width: 90px !important;
      height: 90px !important;
    }
  }
 
  @media (max-width: 480px) {
    .loader svg {
      width: 70px !important;
      height: 70px !important;
    }
  }
 
  @media (max-width: 320px) {
    .loader svg {
      width: 50px !important;
      height: 50px !important;
    }
  }
 

  @keyframes dashArray {
    0% {
      stroke-dasharray: 0 1 359 0;
    }
    50% {
      stroke-dasharray: 0 359 1 0;
    }
    100% {
      stroke-dasharray: 359 1 0 0;
    }
  }

  @keyframes dashOffset {
    0% {
      stroke-dashoffset: 385;
    }
    100% {
      stroke-dashoffset: 5;
    }
  }
`;

export default Loader;
