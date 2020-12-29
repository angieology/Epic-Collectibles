import React from "react";
import PropTypes from 'prop-types';
// import { PropTypes as MobxPropTypes } from "mobx-react";
import TokenImage from "../../../components/TokenImage";
import "./TokenView.css";

const TokenView = ({ token, handleClose }) => (
  <div id="popup1" className="overlay">
    <div className="TokenView-image_wrapper">
      <TokenImage size={200} outer={token[0]} inner={token[1]} />
    </div>
    <div className="TokenView-label">{`${token[0]} – ${token[1]}`}</div>

    <button onClick={handleClose}>Close</button>
  </div>
);

TokenView.propTypes = {
  token: PropTypes.object
};

export default TokenView;
