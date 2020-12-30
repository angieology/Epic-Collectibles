import React from "react";
import PropTypes from "prop-types";


const BackgroundSVG = ({outer, inner, height, width}) => {
  // width = height * 1.25
  const gradId = `${outer}${inner}`.replace(/#/g, "");
  return (
    <svg
      width={width}
      height={height}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="50%" y1="-2.48949813e-15%" x2="50%" y2="100%" >
          <stop offset="0%" stopColor={outer} />
          <stop offset="100%" stopColor={inner} />
        </linearGradient>
      </defs>
      <rect 
      x="0" 
      y="0" 
      width={width}
      height={height}        
      fill={`url(#${gradId})`}
/>
    </svg>
  );
};

BackgroundSVG.propTypes = {
  outer: PropTypes.string.isRequired,
  inner: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default BackgroundSVG;
