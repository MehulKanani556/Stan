import React from 'react';
import styled from 'styled-components';
 
const Loader = () => {
  return (
    <StyledWrapper>
    <div className="loader">
      <svg height={0} width={0} viewBox="0 0 100 100" className="absolute">
        <defs className="s-xJBuHA073rTt" xmlns="http://www.w3.org/2000/svg">
          <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="b">
            <stop className="s-xJBuHA073rTt" stopColor="#8B5CF6" />
            <stop className="s-xJBuHA073rTt" stopColor="#A855F7" offset="0.5" />
            <stop className="s-xJBuHA073rTt" stopColor="#EC4899" offset="1" />
          </linearGradient>
          <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={0} x2={0} y1={64} x1={0} id="c">
            <stop className="s-xJBuHA073rTt" stopColor="#8B5CF6" />
            <stop className="s-xJBuHA073rTt" stopColor="#A855F7" offset="0.5" />
            <stop className="s-xJBuHA073rTt" stopColor="#EC4899" offset="1" />
            <animateTransform repeatCount="indefinite" keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1" keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1" dur="8s" values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32" type="rotate" attributeName="gradientTransform" />
          </linearGradient>
          <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="d">
            <stop className="s-xJBuHA073rTt" stopColor="#EC4899" />
            <stop className="s-xJBuHA073rTt" stopColor="#A855F7" offset="0.5" />
            <stop className="s-xJBuHA073rTt" stopColor="#8B5CF6" offset="1" />
          </linearGradient>
        </defs>
      </svg>
  
      {/* S */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#b)" d="M 75,35 
          C 75,25 65,15 50,15
          C 35,15 25,25 25,35
          C 25,45 35,50 50,50
          C 65,50 75,55 75,65
          C 75,75 65,85 50,85
          C 35,85 25,75 25,65" className="dash" id="S" pathLength={360} />
        </svg>
  
      {/* T */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#c)" d="M20,20 H80 M50,20 V80" className="dash"  id="T1" pathLength={360} />
      </svg>
  
      {/* A */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#d)" d="M20,80 L50,20 L80,80 M35,55 H65" className="dash" id="A1" pathLength={360} />
      </svg>
  
      {/* N */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#c)" d="M20,80 V20 L80,80 V20" className="dash"  id="N1" pathLength={360} />
      </svg>
  
    </div>
  </StyledWrapper>
  );
}
 
const StyledWrapper = styled.div`
  .absolute {
    position: absolute;
  }

  .inline-block {
    display: inline-block;
  }

  .loader {
    display: flex;
    margin: 0.25em 0;
    justify-content: center;
    gap: 0.5em;
  }

  .dash {
    animation: dashArray 2s ease-in-out infinite, dashOffset 2s linear infinite;
  }

  // .spin {
  //   animation: spinDashArray 2s ease-in-out infinite, spin 8s ease-in-out infinite,
  //     dashOffset 2s linear infinite;
  //   transform-origin: center;
  // }

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

  // @keyframes spinDashArray {
  //   0% {
  //     stroke-dasharray: 270 90;
  //   }
  //   50% {
  //     stroke-dasharray: 0 360;
  //   }
  //   100% {
  //     stroke-dasharray: 250 90;
  //   }
  // }

  @keyframes dashOffset {
    0% {
      stroke-dashoffset: 385;
    }
    100% {
      stroke-dashoffset: 5;
    }
  }

  // @keyframes spin {
  //   0% {
  //     rotate: 0deg;
  //   }
  //   12.5%,
  //   25% {
  //     rotate: 270deg;
  //   }
  //   37.5%,
  //   50% {
  //     rotate: 540deg;
  //   }
  //   62.5%,
  //   75% {
  //     rotate: 810deg;
  //   }
  //   87.5%,
  //   100% {
  //     rotate: 1080deg;
  //   }
  // }
`;
 
export default Loader;