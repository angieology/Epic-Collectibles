import React from 'react';
import PropTypes from 'prop-types';
import BackgroundSVG from './BackgroundSVG';
import outlineImage from "./epic-outline.png";

import './TokenImage.css';

const TokenImage = ({outer, inner, height=200, width=250}) => (
    <div className="image_wrapper">
    <img height={height} width={width} className="outline" alt="" src={outlineImage}/>
    <BackgroundSVG  outer={outer} inner={inner} height={height} width={width}/>
  </div>
)



TokenImage.propTypes = {
  outer: PropTypes.string.isRequired,
  inner: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

export default TokenImage

