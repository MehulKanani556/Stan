import React from 'react';
import styled from 'styled-components';
 
const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <svg height={0} width={0} viewBox="0 0 100 100" className="absolute">
          <defs className="s-xJBuHA073rTt" xmlns="http://www.w3.org/2000/svg">
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="b">
              <stop className="s-xJBuHA073rTt" stopColor="#0369a1" />
              <stop className="s-xJBuHA073rTt" stopColor="#67e8f9" offset="1.5" />
            </linearGradient>
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={0} x2={0} y1={64} x1={0} id="c">
              <stop className="s-xJBuHA073rTt" stopColor="#0369a1" />
              <stop className="s-xJBuHA073rTt" stopColor="#22d3ee" offset={1} />
              <animateTransform repeatCount="indefinite" keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1" keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1" dur="8s" values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32" type="rotate" attributeName="gradientTransform" />
            </linearGradient>
            <linearGradient className="s-xJBuHA073rTt" gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="d">
              <stop className="s-xJBuHA073rTt" stopColor="#38bdf8" />
              <stop className="s-xJBuHA073rTt" stopColor="#075985" offset="1.5" />
            </linearGradient>
          </defs>
        </svg>
       
        {/* First Y */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#b)" d="M 20,20 L 50,50 L 80,20 M 50,50 L 50,80" className="dash" id="Y1" pathLength={360} />
        </svg>
       
        {/* First O */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#c)" d="M 50,15  
          A 35,35 0 0 1 85,50  
          A 35,35 0 0 1 50,85  
          A 35,35 0 0 1 15,50  
          A 35,35 0 0 1 50,15 Z" className="spin" id="O1" pathLength={360} />
        </svg>
       
        {/* Second Y */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#d)" d="M 20,20 L 50,50 L 80,20 M 50,50 L 50,80" className="dash" id="Y2" pathLength={360} />
        </svg>
       
        {/* Second O */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width={100} height={100} className="inline-block">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={10} stroke="url(#c)" d="M 50,15  
          A 35,35 0 0 1 85,50  
          A 35,35 0 0 1 50,85  
          A 35,35 0 0 1 15,50  
          A 35,35 0 0 1 50,15 Z" className="spin" id="O2" pathLength={360} />
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
  }
 
  .w-2 {
    width: 0.5em;
  }
 
  .dash {
    animation: dashArray 2s ease-in-out infinite, dashOffset 2s linear infinite;
  }
 
  .spin {
    animation: spinDashArray 2s ease-in-out infinite, spin 8s ease-in-out infinite,
      dashOffset 2s linear infinite;
    transform-origin: center;
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
 
  @keyframes spinDashArray {
    0% {
      stroke-dasharray: 270 90;
    }
 
    50% {
      stroke-dasharray: 0 360;
    }
 
    100% {
      stroke-dasharray: 250 90;
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
 
  @keyframes spin {
    0% {
      rotate: 0deg;
    }
 
    12.5%,
    25% {
      rotate: 270deg;
    }
 
    37.5%,
    50% {
      rotate: 540deg;
    }
 
    62.5%,
    75% {
      rotate: 810deg;
    }
 
    87.5%,
    100% {
      rotate: 1080deg;
    }
  }
`;
 
export default Loader;