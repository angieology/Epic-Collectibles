import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import TokenImage from "../../../components/TokenImage";
import ContractContext from "../../../Store";

import "./TokenView.css";

const TokenView = ({ token, onCloseClicked }) => {
  const { index: tokenID, gradient } = token;
  const [state, dispatch] = useContext(ContractContext);

  const [askPrice, setAskPrice] = useState(5);
  const [tokensOnSale, setTokensOnSale] = useState([]);
  const [ownerTokens, setOwnerTokens] = useState([]);

  let createAuction, bid, cancel;

  const handleSellFormChange = (event) => {
    setAskPrice(event.target.value);
  };
  useEffect(() => {
    if (state) {
      setTokensOnSale(state.tokensOnSale);
      setOwnerTokens(state.ownerTokens);
      createAuction = state.createAuction;
      bid = state.bid;
      cancel = state.cancel;
    }
  }, [state]);


  const isOnSale = tokensOnSale.includes(tokenID);
  const isOwned = ownerTokens.includes(tokenID);

  const handleSellSubmit = async () => {
    const newAuctionRes = await state.createAuction(tokenID, askPrice, state.owner);

    dispatch({ type: "SET_TOKENS_ON_SALE", payload: newAuctionRes });
  };
  return (
    <div className="TokenView-layout">
      <button className="close" onClick={onCloseClicked} />

      <div className="TokenView-content_wrapper">
        <TokenImage outer={gradient.outer} inner={gradient.inner} />

        <div className="TokenView-details_wrapper">
          <div className="TokenView-label">{`${gradient.outer} – ${gradient.inner}`}</div>
          {isOwned && <p>Owned by me</p>}

          {isOwned && !isOnSale && (
            <>
              <label>
                Price:{" "}
                <input
                  type="text"
                  value={askPrice}
                  name="askPrice"
                  onChange={handleSellFormChange}
                />
              </label>
              <button onClick={handleSellSubmit}>sell</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

TokenView.propTypes = {
  token: PropTypes.object,
};

export default TokenView;

