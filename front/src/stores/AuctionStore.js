import getAccounts from "../utils/getAccounts";

var Web3 = require("web3");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default class AuctionStore {
  tokensOnSale = [];
  tokenToAuction = {};

  // Auction depends on the existence of its instance in the contract store
  // and a epic token to construct the auction
  constructor(contractsStore) {
    this.contractsStore = contractsStore;
  }

  get auctionInstance() {
    return this.contractsStore && this.contractsStore.auctionInstance;
  }

  // all initial set and data that needs to be fetched on app init
  setup = async () => {
    await this.fetchActiveAuctions();
  };

  getAuctionAddress = () => {
    return this.auctionInstance.address;
  };

  fetchActiveAuctions = async () => {
    // roundabout way to fetch all tokens on sale, since we cannot retrieve the entire mapping at once
    // const accounts = await getAccounts();

    const supply = await this.contractsStore.epicTokenInstance.totalSupply();

    const saleTokensRaw = await Promise.all(
      [...Array(supply.toNumber()).keys()].map(async (tokenId) => {
        return this.auctionInstance.tokenIdToAuction(tokenId);
      })
    );
    console.log("live auctions", saleTokensRaw);
    // seller should not be zero address
    const updatedTokensOnSale = [];
    const updateTokenToAuction = {};
    saleTokensRaw.forEach((auction, tokenID) => {
      if (auction.seller.toString() !== ZERO_ADDRESS) {
        updatedTokensOnSale.push(tokenID);
        updateTokenToAuction[tokenID] = {
          seller: auction.seller.toString(),
          price: Web3.utils.fromWei(auction.price.toString(), "ether"),
        };
      }
    });
    this.setTokensOnSale(updatedTokensOnSale);
    this.tokenToAuction = updateTokenToAuction;
    return {
      tokensOnSale: updatedTokensOnSale,
      tokenToAuction: updateTokenToAuction,
    };
  };

  setTokensOnSale = (tokensOnSale) => {
    this.tokensOnSale = tokensOnSale;
  };

  /**
   *
   * @param {int} tokenID , id of non-fungible token
   * @param {float} askPrice , represented in ether
   * @returns {array} returns refreshed list of current tokens on sale
   */
  createAuction = async (tokenID, askPrice) => {
    if (askPrice < 0 || askPrice > 100) return;

    try {
      const accounts = await getAccounts();
      const priceInWei = Web3.utils.toWei(askPrice.toString(), "ether");
      const tokenIndex = await this.contractsStore.epicTokenInstance.tokenByIndex(
        tokenID,
        { from: accounts[0] }
      );
      await this.contractsStore.epicTokenInstance.approve(
        this.auctionInstance.address,
        tokenIndex,
        { from: accounts[0] }
      );

      await this.auctionInstance.createAuction(tokenID, priceInWei, {
        from: accounts[0],
      });
      const tokenUpdate = await this.fetchActiveAuctions();
      return tokenUpdate;
    } catch (e) {
      console.warn(e);
    }
  };

  bid = async (tokenID, bidPrice) => {
    const accounts = await getAccounts();
    try {
      const receipt = await this.auctionInstance.bid(tokenID.toString(), {
        from: accounts[0],
        value: Web3.utils.toWei(bidPrice.toString(), "ether"),
      });
      console.log({ receipt });
      return await this.fetchActiveAuctions();
    } catch (e) {
      console.warn(e);
    }
  };

  cancel = async (tokenID) => {
    const accounts = await getAccounts();
    try {
      const receipt = await this.auctionInstance.cancel(tokenID.toString(), {
        from: accounts[0],
      });
      console.log({ receipt });
      return await this.fetchActiveAuctions();
    } catch (e) {
      console.warn(e);
    }
  };
}
