import getEpicContractInstance from "../utils/getEpicContractInstance";
import getAuctionContractInstance from '../utils/getAuctionContractInstance';
//store all contract instances, including auction
export default class ContractsStore {
  epicTokenInstance = null;
  auctionInstance = null; //TODO

  async setup() {
      this.setEpicTokenInstance(await getEpicContractInstance());
      this.setAuctionInstance(await getAuctionContractInstance());
  }

  setEpicTokenInstance(epicTokenInstance) {
    this.epicTokenInstance = epicTokenInstance;
  }

  setAuctionInstance(auctionInstance) {
    this.auctionInstance = auctionInstance;
  }
}


