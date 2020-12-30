import getAccounts from "../utils/getAccounts";

var Web3 = require("web3");

// handles all gradient token contract related functionality, per owner
export default class GradientTokenStore {
  // array of int TokenID
  tokens = [];
  // array of int TokenID
  ownerTokens = [];
  // owner of NFT has to give permission to others to mint etc.
  owner = null;
  isLoading = true;

  constructor(contractsStore) {
    this.contractsStore = contractsStore;
    // if (contractsStore.gradientTokenInstance) this.setup();
  }

  get gradientTokenInstance() {
    return this.contractsStore && this.contractsStore.gradientTokenInstance;
  }

  setup = async () => {
    // const owner = await this.gradientTokenInstance.owner();
    // this.setOwner(owner)
    const currentUserAccounts = await getAccounts();
    this.setOwner(currentUserAccounts[0])
    await this.fetchTokens();
  }

  setIsLoading(state){
      if(!Boolean(state)) return;
      this.isLoading = state;
  }

  setTokens(tokens){
      this.tokens = tokens;
  }

  setOwner(owner) {
    this.owner = owner;
  }

  fetchTokens = async () => {
    // get all tokens of owner:
    // roundabout way since ownerOf is depreciated
    const supply = await this.gradientTokenInstance.totalSupply();

    const owners = await Promise.all(
        [...Array(supply.toNumber()).keys()].map(async (token) => {
        return this.gradientTokenInstance.ownerOf(token);
      })
    );
    // all token IDs are indexed from 0. The index of the owner address in the owners address
    // is equivalent to the token ID.
    // filter and save all index numbers of this owner into ownerTokens
    const newOwnerTokens = [];
console.log('in fetch tokens, owner is', owners)
    owners.forEach((o, index) => {
      if (o.toString() === this.owner.toString()) {
        //replace whole ownerTokens
        newOwnerTokens.push(index)
      }

    })
    this.ownerTokens = newOwnerTokens;

    // get gradient details for all tokens
    const gradients = await Promise.all(
        [...Array(supply.toNumber()).keys()].map(async (token) => {
        return this.gradientTokenInstance.getGradient(token);
      })
    );
    this.setIsLoading(false);
    if (!gradients.length) {
      return;
    }
    // mobx style - depreciated
    const newTokens = this.indexedTokens(gradients);
    this.setTokens(newTokens);
    return {tokens: newTokens, isLoading: false, ownerTokens: newOwnerTokens};
  };
  indexedTokens(gradients) {
    return gradients.map((gradient, index) => {
      return {
        gradient,
        index,
      };
    });
  }
  // create new ones
  mintToken = async (gradient) => {

    const accounts = await getAccounts();
    await this.gradientTokenInstance.mint(gradient[0], gradient[1], {
      from: accounts[0],
      value: Web3.utils.toWei("5", "ether")
    //   gas: 200000 // only manually set gas if not using wallet (ie. httpProvider)
     });
     // TODO might be better to fetch new list of tokens?
    this.appendToken({ gradient, index: this.tokens.length });
  };
  appendToken(token) {
    this.tokens.push(token);
  }

}

