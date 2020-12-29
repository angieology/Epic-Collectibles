
var Web3 = require("web3");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default class AuctionStore {
  tokensOnSale = [];
  

    // Auction depends on the existence of its instance in the contract store
    // and a gradient token to construct the auction
  constructor(contractsStore) {
    this.contractsStore = contractsStore;
  }

  get auctionInstance() {
    return this.contractsStore && this.contractsStore.auctionInstance;
  }

  // all initial set and data that needs to be fetched on app init
  setup = async () => {
    await this.fetchActiveAuctions();
  }

  getAuctionAddress = () => {
    return this.auctionInstance.address;
  }

 fetchActiveAuctions = async () => {
  // roundabout way to fetch all tokens on sale, since we cannot retrieve the entire mapping at once

    const supply = await this.contractsStore.gradientTokenInstance.totalSupply();

    const saleTokensRaw = await Promise.all(
        [...Array(supply.toNumber()).keys()].map(async (tokenId) => {
        return this.auctionInstance.tokenIdToAuction(tokenId);
      })
    );
    // seller should not be zero address
    const updatedTokensOnSale = [];
    saleTokensRaw.forEach((auction, tokenID) => {
      if (auction.seller !== ZERO_ADDRESS) {
        updatedTokensOnSale.push(tokenID);
      } 
    });
    this.setTokensOnSale(updatedTokensOnSale);
    return updatedTokensOnSale;
 }  

 setTokensOnSale = (tokensOnSale) => {
   this.tokensOnSale = tokensOnSale;
 }

 /**
  * 
  * @param {int} tokenID , id of non-fungible token
  * @param {float} askPrice , represented in ether
  * @returns {array} returns refreshed list of current tokens on sale
  */
 createAuction = async (tokenID, askPrice) => { //TODO replace owner with accounts
   if (askPrice < 0 || askPrice > 100) return;


   try {
     const accounts = getAccounts();

      const priceInWei = Web3.utils.toWei(askPrice.toString(), "ether")
      const tokenIndex = await this.contractsStore.gradientTokenInstance.tokenByIndex(tokenID);
      await this.contractsStore.gradientTokenInstance.approve(this.auctionInstance.address, tokenIndex, { from: accounts[0] });
      
      await this.auctionInstance.createAuction(tokenID, priceInWei, { from: accounts[0] });
      const updatedTokensOnSale = await this.fetchActiveAuctions(accounts[0]); // do i need to get per owner, or just all
      return updatedTokensOnSale;
   } catch (e) {
     console.warn(e);
   }
 
 }

 bid = async (tokenID, bidPrice) => {

 }

 cancel = async (tokenID) => {

 }
}

