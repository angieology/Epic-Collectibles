// import { observable, action, decorate, computed, when } from "mobx";
// import randomColor from "utils/randomColor";
var Web3 = require("web3");

// handles all gradient token contract related functionality, per owner
export default class GradientTokenStore {
  tokens = [];
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
    const owner = await this.gradientTokenInstance.owner();
    this.setOwner(owner);
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
    // get all tokens of owner
    // roundabout way since ownerOf is depreciated 🤦🏻‍♀️
    const supply = await this.gradientTokenInstance.totalSupply();

    const owners = await Promise.all(
        [...Array(supply.toNumber()).keys()].map(async (token) => {
        return this.gradientTokenInstance.ownerOf(token);
      })
    );
    const mappedTokenIDOwners = { ...owners}
//TODO fetch for only this user

    // [ownerAddress1, ownerAddress2 ...]
//convert to an object where index of array is obj key, is the tokenID

    // get gradient structs related to the token id (colors)
    const gradients = await Promise.all(
        [...Array(supply.toNumber()).keys()].map(async (token) => {
        return this.gradientTokenInstance.getGradient(token);
      })
    );
    this.setIsLoading(false);
    if (!gradients.length) {
      return;
    }
    // mobx
    this.setTokens(this.indexedTokens(gradients));
    return this.tokens;
  };

  // show all list of tokens in React (iteratively)
 // TODO fix
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
    await this.gradientTokenInstance.mint(gradient[0], gradient[1], {
      from: this.owner,
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

// export default decorate(GradientTokenStore, {
//   owner: observable,
//   tokens: observable,
//   isLoading: observable,
//   gradientTokenInstance: computed,
// });
