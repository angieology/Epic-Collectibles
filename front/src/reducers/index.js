const Reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_STORE":
      return {
        ...state,
        ...action.epicTokenStore,
        ...action.auctionStore,
      };
    case "UPDATE_TOKENS":
      const { tokens, isLoading, ownerTokens } = action.payload;
      return { ...state, tokens, isLoading, ownerTokens };
    case "SET_TOKENS_ON_SALE":
      const { tokensOnSale, tokenToAuction } = action.payload;
      return { ...state, tokensOnSale, tokenToAuction};
    default:
      return state;
  }
};

export default Reducer;
