import { useState, useEffect, useContext } from "react";
import ContractContext from "../Store";

const useTokenStatus = (tokenID) => {
  const [state] = useContext(ContractContext);

  const [tokensOnSale, setTokensOnSale] = useState([]);
  const [ownerTokens, setOwnerTokens] = useState([]);
  const [tokenToAuction, setTokenToAuction] = useState({});

  const [isOwned, setIsOwned] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);

  useEffect(() => {
    if (state) {
      setTokensOnSale(state.tokensOnSale);
      setOwnerTokens(state.ownerTokens);
      setTokenToAuction(state.tokenToAuction);
    }
  }, [state]);

  useEffect(() => {
    // if item is on sale, the auction is the 'owner'. To check if this token really
    // belongs to user, also check auction for 'seller' listings
    const newOwned =
      (ownerTokens && ownerTokens.includes(tokenID)) ||
      (tokenToAuction &&
        tokenToAuction[tokenID] &&
        tokenToAuction[tokenID].seller === state.owner.toString());
    setIsOwned(newOwned);
  }, [ownerTokens, tokensOnSale, tokenToAuction]);

  useEffect(() => {
    const newSale = tokensOnSale && tokensOnSale.includes(tokenID);
    setIsOnSale(newSale);
  });
  return [isOwned, isOnSale];
};

export default useTokenStatus;
