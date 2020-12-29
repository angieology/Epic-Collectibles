import React, { useState } from "react";
import PropTypes from "prop-types";
// import { PropTypes as MobxPropTypes } from "mobx-react";
import TokenView from "../TokenView";

import TokenImage from "../../../components/TokenImage";
import outlineImage from "./epic-outline.png";
import "./TokenItem.css";

const TokenItem = ({ token }) => {
  const [isOpen, showModal] = useState(false);
  const handleOpen =() => {
    showModal(true)
  }

  return (
    <>
    {isOpen && <TokenView token={token} handleClose={()=> showModal(false)}/>}
    <div className="TokenItem" onClick={handleOpen}  href="#popup1">
      <div className="TokenItem-image_wrapper">
        <img height="200px" className="outline" alt="" src={outlineImage}/>
        <TokenImage outer={token[0]} inner={token[1]}/>
      </div>
      <div className="TokenItem-label">{`${token[0]} – ${token[1]}`}</div>
    </div>
    </>
  );
};

TokenItem.propTypes = {
  token: PropTypes.array,
  onClick: PropTypes.func
};

export default TokenItem;
