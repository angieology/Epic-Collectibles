import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import PetIcon from "@material-ui/icons/Pets";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

import TokenImage from "../../../components/TokenImage";
import ContractContext from "../../../Store";
import useTokenStatus from "../../../utils/useTokenStatus";
import epcoinSym from "../../../images/epcoin.png";

import "./TokenView.css";

const TokenView = ({ token, onCloseClicked }) => {
  const { index: tokenID, attributes } = token;
  const [state, dispatch] = useContext(ContractContext);

  const [askPrice, setAskPrice] = useState(5);

  const [isOwned, isOnSale, price] = useTokenStatus(tokenID);

  const [bidPrice, setBidPrice] = useState(price);

  const { element, name } = attributes;
  const stats = JSON.parse(attributes.stats);
  const abilities = JSON.parse(attributes.abilities);

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
  
    if (isNaN(bidPrice)) { alert('Enter a number'); return }
    if (bidPrice < parseInt(price)) {
      alert("Can't bid lower than the ask price");
      return;
    }
    try {
      const auctionRes = await state.bid(tokenID, bidPrice);

      const updateTokenList = await state.fetchTokens();

      dispatch({ type: "SET_TOKENS_ON_SALE", payload: auctionRes });
      dispatch({ type: "UPDATE_TOKENS", payload: updateTokenList });
    } catch (e) {
      console.warn();
    }
  };

  const handleCancel = async () => {
    const auctionRes = await state.cancel(tokenID);
    dispatch({ type: "SET_TOKENS_ON_SALE", payload: auctionRes });
  };

  return (
    <div className={`TokenView-layout card ${element.toLowerCase()}`}>
      <div className="circles" />
      <div className="TokenView-above-circle">
        <button className="close" onClick={onCloseClicked} />
        <div className={`TokenView-content_wrapper `}>
          <div>
            {attributes && (
              <TokenImage outer={attributes.outer} inner={attributes.inner} />
            )}

            <div className="TokenView-label bean">#{tokenID}</div>
            <div className="TokenView-label">Name: {name}</div>
            <div className="TokenView-label">Type: {element}</div>

            {Object.entries(stats).map(([key, value]) => (
              <div className="TokenView-label" key={key}>
                {key}: {value}
              </div>
            ))}
          </div>
          <div className="TokenView-details_wrapper">
            <div className="TokenView-label">
              Abilities:
              {Object.entries(abilities).map(([key, value]) => (
                <>
                  <div className="stat-layout">
                    <span className="stat-key">{key}</span>{" "}
                    <span className="stat-value">{value}</span>
                  </div>
                  <div className={`stat-bar ${element.toLowerCase()}`}>
                    <div
                      className="stat-bar_filler"
                      style={{ width: `${(value / 1000) * 100}%` }}
                    ></div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        <div className="TokenView-actions">
          <div>
            {isOwned && (
              <p className="text-with-icon">
                <PetIcon /> Owned by me{" "}
              </p>
            )}
            {isOnSale && (
              <p className="text-with-icon">
                <LoyaltyIcon /> Currently on sale for{" "}
                <span className="price">
                  <img src={epcoinSym} alt="" />
                  {price}{" "}
                </span>
              </p>
            )}
          </div>

          <div>
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
                <button
                  onClick={handleSellSubmit}
                  className="button button--winona button--border-thin button--round-s"
                  data-text="Sell"
                >
                  <span>Sell</span>
                </button>
              </>
            )}

            {isOwned && isOnSale && (
              <>
                <button
                  onClick={handleCancel}
                  className="button button--winona button--border-thin button--round-s"
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
                  className="button button--winona button--border-thin button--round-s "
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
    </div>
  );
};

TokenView.propTypes = {
  token: PropTypes.object,
};

export default TokenView;
