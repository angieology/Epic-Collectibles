import { useState, useEffect, useContext } from "react";
import ContractContext from "../Store";

const useTokenStatus = (tokenID) => {
  const [state] = useContext(ContractContext);

  const [tokensOnSale, setTokensOnSale] = useState([]);
  const [ownerTokens, setOwnerTokens] = useState([]);
  const [tokenIDToSeller, setTokenIDToSeller] = useState({});

  const [isOwned, setIsOwned] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);

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

  useEffect(() => {
    const newSale = tokensOnSale && tokensOnSale.includes(tokenID);
    setIsOnSale(newSale);
  });
  console.log({ tokenID });
  console.log({ isOwned });
  console.log({ isOnSale });
  return [isOwned, isOnSale];
};

export default useTokenStatus;
