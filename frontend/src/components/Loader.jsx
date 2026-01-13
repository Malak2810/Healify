// src/components/Loader.jsx
import React from "react";
import styled from "styled-components";

const Loader = ({ size = 48 }) => {
  return (
    <StyledWrapper role="status" aria-live="polite" aria-label="Loading">
      <div className="loading" style={{ width: size * 1.33, height: size }}>
        <svg height={`${size}px`} width={`${size * 1.33}px`} viewBox="0 0 64 48" preserveAspectRatio="xMidYMid slice">
          <polyline id="back" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" />
          <polyline id="front" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" />
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-block;
  .loading svg polyline {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .loading svg polyline#back {
    stroke: rgba(0,0,0,0.06);
  }

  .loading svg polyline#front {
    stroke: #2a6df6; /* blue shade */
    stroke-dasharray: 48, 144;
    stroke-dashoffset: 192;
    animation: dash 1.4s linear infinite;
  }

  @keyframes dash {
    72.5% {
      opacity: 0;
    }

    to {
      stroke-dashoffset: 0;
    }
  }
`;

export default Loader;
