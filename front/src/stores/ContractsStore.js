import getGradientContractInstance from "../utils/getGradientContractInstance";
import getAuctionContractInstance from '../utils/getAuctionContractInstance';
//store all contract instances, including auction
export default class ContractsStore {
  gradientTokenInstance = null;
  auctionInstance = null; //TODO

  async setup() {
      this.setGradientTokenInstance(await getGradientContractInstance());
      this.setAuctionInstance(await getAuctionContractInstance());
  }

  setGradientTokenInstance(gradientTokenInstance) {
    this.gradientTokenInstance = gradientTokenInstance;
  }

  setAuctionInstance(auctionInstance) {
    this.auctionInstance = auctionInstance;
  }
}


