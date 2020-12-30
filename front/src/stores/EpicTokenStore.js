import getAccounts from "../utils/getAccounts";

var Web3 = require("web3");

// handles all epic token contract related functionality, per owner
export default class EpicTokenStore {
  // array of int TokenID
  tokens = [];
  // array of int TokenID
  ownerTokens = [];
  // owner of NFT has to give permission to others to mint etc.
  owner = null;
  isLoading = true;

  constructor(contractsStore) {
    this.contractsStore = contractsStore;
    // if (contractsStore.epicTokenInstance) this.setup();
  }

  get epicTokenInstance() {
    return this.contractsStore && this.contractsStore.epicTokenInstance;
  }

  setup = async () => {
    // const owner = await this.epicTokenInstance.owner();
    // this.setOwner(owner)
    const currentUserAccounts = await getAccounts();
    this.setOwner(currentUserAccounts[0]);
    await this.fetchTokens();
  };

  setIsLoading(state) {
    if (!Boolean(state)) return;
    this.isLoading = state;
  }

  setTokens(tokens) {
    this.tokens = tokens;
  }

  setOwner(owner) {
    this.owner = owner;
  }

  fetchTokens = async () => {
    // get all tokens of owner:
    // roundabout way since ownerOf is depreciated
    const supply = await this.epicTokenInstance.totalSupply();

    const owners = await Promise.all(
      [...Array(supply.toNumber()).keys()].map(async (token) => {
        return this.epicTokenInstance.ownerOf(token);
      })
    );
    // all token IDs are indexed from 0. The index of the owner address in the owners address
    // is equivalent to the token ID.
    // filter and save all index numbers of this owner into ownerTokens
    const newOwnerTokens = [];
    console.log("in fetch tokens, owner is", owners);
    owners.forEach((o, index) => {
      if (o.toString() === this.owner.toString()) {
        //replace whole ownerTokens
        newOwnerTokens.push(index);
      }
    });
    this.ownerTokens = newOwnerTokens;

    // get epic details for all tokens
    const epics = await Promise.all(
      [...Array(supply.toNumber()).keys()].map(async (token) => {
        return this.epicTokenInstance.getEpic(token);
      })
    );
    this.setIsLoading(false);
    if (!epics.length) {
      return;
    }
    // mobx style - depreciated
    const newTokens = this.indexedTokens(epics);
    console.log({ newTokens });
    this.setTokens(newTokens);
    return { tokens: newTokens, isLoading: false, ownerTokens: newOwnerTokens };
  };

  indexedTokens(epics) {
    console.log({epics})
    return epics.map((epic, index) => {
      return {
        attributes: epic,
        index,
      };
    });
  }
  // create new ones
  /**
   * 
   * @param {array} epic  array of feature strings
   */
  mintToken = async (epic) => {
    const accounts = await getAccounts();
    await this.epicTokenInstance.mint(...epic, {
      from: accounts[0],
      value: Web3.utils.toWei("5", "ether"),
      //   gas: 200000 // only manually set gas if not using wallet (ie. httpProvider)
    });
    // TODO might be better to fetch new list of tokens?
    this.appendToken({ epic, index: this.tokens.length });
  };
  appendToken(token) {
    this.tokens.push(token);
  }
}
