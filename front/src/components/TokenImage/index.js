import React from 'react';
import PropTypes from 'prop-types';
import BackgroundSVG from './BackgroundSVG';
import outlineImage from "./epic-outline.png";

import './TokenImage.css';

const TokenImage = ({outer, inner, size}) => (
    
    <div className="image_wrapper">
    <img height="200px" className="outline" alt="" src={outlineImage}/>
    <BackgroundSVG outer={outer} inner={inner}/>
  </div>
)



TokenImage.propTypes = {
  outer: PropTypes.string.isRequired,
  inner: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default TokenImage

