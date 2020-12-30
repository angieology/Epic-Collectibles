const Reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_STORE":
      return {
        ...state,
        ...action.gradientTokenStore,
        ...action.auctionStore,
      };
    case "UPDATE_TOKENS":
      const { tokens, isLoading, ownerTokens } = action.payload;
      return { ...state, tokens, isLoading, ownerTokens };
    case "SET_TOKENS_ON_SALE":
      return { ...state, tokensOnSale: action.payload};
    default:
      return state;
  }
};

export default Reducer;
