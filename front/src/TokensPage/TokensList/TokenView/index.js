import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import GavelIcon from "@material-ui/icons/Gavel";
import PetIcon from "@material-ui/icons/Pets";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

import TokenImage from "../../../components/TokenImage";
import ContractContext from "../../../Store";
import useTokenStatus from "../../../utils/useTokenStatus";

import "./TokenView.css";

const TokenView = ({ token, onCloseClicked }) => {
  const { index: tokenID, gradient } = token;
  const [state, dispatch] = useContext(ContractContext);

  const [askPrice, setAskPrice] = useState(5);
  const [bidPrice, setBidPrice] = useState(5);

  const [isOwned, isOnSale] = useTokenStatus(tokenID);


  const handleSellFormChange = (event) => {
    setAskPrice(event.target.value);
  };

  const handleBidFormChange = (event) => {
    setBidPrice(event.target.value);
  };
 

  const handleSellSubmit = async () => {
    const auctionRes = await state.createAuction(
      tokenID,
      askPrice,
      state.owner
    );

    dispatch({ type: "SET_TOKENS_ON_SALE", payload: auctionRes });
  };

  const handleBidSubmit = async () => {
    const auctionRes = await state.bid(tokenID, askPrice);
    const updateTokenList = await state.fetchTokens();

    dispatch({ type: "SET_TOKENS_ON_SALE", payload: auctionRes });
    dispatch({ type: "UPDATE_TOKENS", payload: updateTokenList });
  };

  const handleCancel = async () => {
    const auctionRes = await state.cancel(tokenID);
    dispatch({ type: "SET_TOKENS_ON_SALE", payload: auctionRes });
  };

  return (
    <div className="TokenView-layout">
      <button className="close" onClick={onCloseClicked} />

      <div className="TokenView-content_wrapper">
        <TokenImage outer={gradient.outer} inner={gradient.inner} />

        <div className="TokenView-details_wrapper">
        <div className="TokenView-label">Token ID: <span className="bold-highlight">{tokenID}</span> </div>
          <div className="TokenView-label">Skin: {`${gradient.outer} – ${gradient.inner}`}</div>
          {isOwned && (
            <p className="text-with-icon">
              <PetIcon /> Owned by me{" "}
            </p>
          )}

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
              <button onClick={handleSellSubmit} class="button button--winona button--border-thin button--round-s"
                data-text="Sell"
              >
                <span>Sell</span>
              </button>
            </>
          )}
          {isOnSale && (
            <p className="text-with-icon">
              <LoyaltyIcon /> Currently on sale
            </p>
          )}
          {isOwned && isOnSale && (
            <>
              <button
                onClick={handleCancel}
                class="button button--winona button--border-thin button--round-s"
                data-text="Cancel Auction"
              >
                <span>Cancel Auction</span>
              </button>
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
              <button
                onClick={handleBidSubmit}
                class="button button--winona button--border-thin button--round-s "
                data-text="Make Bid"
              >
               
               <span> Make Bid</span>
              </button>
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
