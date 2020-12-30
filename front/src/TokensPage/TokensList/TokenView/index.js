import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import TokenImage from "../../../components/TokenImage";
import ContractContext from "../../../Store";

import "./TokenView.css";

const TokenView = ({ token, onCloseClicked }) => {
  const { index: tokenID, gradient } = token;
  const [state, dispatch] = useContext(ContractContext);

  const [askPrice, setAskPrice] = useState(5);
  const [bidPrice, setBidPrice] = useState(5);

  const [tokensOnSale, setTokensOnSale] = useState([]);
  const [ownerTokens, setOwnerTokens] = useState([]);

  // let createAuction, bid, cancel, fetchTokens;

  const handleSellFormChange = (event) => {
    setAskPrice(event.target.value);
  };

  const handleBidFormChange = (event) => {
    setBidPrice(event.target.value);
  }
  useEffect(() => {
    if (state) {
      console.log({state})
      setTokensOnSale(state.tokensOnSale);
      setOwnerTokens(state.ownerTokens);
      // createAuction = state.createAuction;
      // bid = state.bid;
      // cancel = state.cancel;
      // fetchTokens = state.fetchTokens;
    }
  }, [state]);


  const isOnSale = tokensOnSale && tokensOnSale.includes(tokenID);
  const isOwned = ownerTokens && ownerTokens.includes(tokenID);

  const handleSellSubmit = async () => {
    const newAuctionRes = await state.createAuction(tokenID, askPrice, state.owner);

    dispatch({ type: "SET_TOKENS_ON_SALE", payload: newAuctionRes });
  };

  const handleBidSubmit = async () => {
    const bidResult = await state.bid(tokenID, askPrice);
    const updateTokenList = await state.fetchTokens();
   
    dispatch({ type: "SET_TOKENS_ON_SALE", payload: bidResult });
    dispatch({type: 'UPDATE_TOKENS', payload: updateTokenList })
  };


console.log(token.index)
console.log({isOwned})
console.log({isOnSale})

  const handleCancel = async () => {
    const updatedTokensOnSale = await state.cancel(tokenID);
    console.log({updatedTokensOnSale});
    dispatch({ type: "SET_TOKENS_ON_SALE", payload: updatedTokensOnSale })
  }
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

          {isOwned && isOnSale && (
            <>
            <p>Currently on sale.</p>
            <button onClick={handleCancel}>Cancel Auction</button>
            </>
          )}

          {!isOwned && isOnSale && (
            <>
            <label>
                Bid Price:{" "}
                <input
                  type="text"
                  value={bidPrice}
                  name="bidPrice"
                  onChange={handleBidFormChange}
                />
              </label>
              <button onClick={handleBidSubmit}>buy</button>
              <span>{}</span>
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

