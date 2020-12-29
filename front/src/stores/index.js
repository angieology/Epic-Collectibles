import ContractsStore from "./ContractsStore";
import GradientTokenStore from "./GradientTokenStore";
import AuctionStore from './AuctionStore';

const setupContracts = async () => {
    const contractsStore = new ContractsStore();
    await contractsStore.setup();
    
    const gradientTokenStore = new GradientTokenStore(contractsStore);
    // check contract is deployed and reference is available before setup
    if (contractsStore.gradientTokenInstance) await gradientTokenStore.setup();
 
    // Auction was deployed with the gradient token as constructor param in migration script
    const auctionStore = new AuctionStore(contractsStore);
    if(contractsStore.auctionInstance) await auctionStore.setup();


    return {
        contractsStore,
        gradientTokenStore,
        auctionStore
      }
}

export default setupContracts;