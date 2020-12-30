import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import GavelIcon from "@material-ui/icons/Gavel";
import PetIcon from "@material-ui/icons/Pets";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

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
  const [tokenIDToSeller, setTokenIDToSeller] = useState({});

  const [isOwned, setIsOwned] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);

  const handleSellFormChange = (event) => {
    setAskPrice(event.target.value);
  };

  const handleBidFormChange = (event) => {
    setBidPrice(event.target.value);
  };
  useEffect(() => {
    if (state) {
      setTokensOnSale(state.tokensOnSale);
      setOwnerTokens(state.ownerTokens);
      setTokenIDToSeller(state.tokenIDToSeller);
    }
  }, [state]);

  useEffect(() => {
    // if item is on sale, the auction is the 'owner'. To check if this token really
    // belongs to user, also check auction for 'seller' listings
    const newOwned =
      (ownerTokens && ownerTokens.includes(tokenID)) ||
      (tokenIDToSeller &&
        tokenIDToSeller[tokenID] &&
        tokenIDToSeller[tokenID] === state.owner.toString());
    setIsOwned(newOwned);
  }, [ownerTokens, tokensOnSale, tokenIDToSeller]);

  useEffect(()=> {
    const newSale = tokensOnSale && tokensOnSale.includes(tokenID);
    setIsOnSale(newSale);
  })

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
          <div className="TokenView-label">{`${gradient.outer} – ${gradient.inner}`}</div>
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
              <button onClick={handleSellSubmit}>sell</button>
            </>
          )}

          {isOwned && isOnSale && (
            <>
              <p className="text-with-icon">
                <LoyaltyIcon /> Currently on sale
              </p>

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
              <button onClick={handleBidSubmit} className="text-with-icon">
                <GavelIcon />
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
