import getGradientContractInstance from "../utils/getGradientContractInstance";

//store all contract instances, including auction
export default class ContractsStore {
  gradientTokenInstance = null;
  auctionInstance = null; //TODO

  async setup() {
  
      this.setGradientTokenInstance(await getGradientContractInstance());

  }

  setGradientTokenInstance(gradientTokenInstance) {
    this.gradientTokenInstance = gradientTokenInstance;
  }
}


