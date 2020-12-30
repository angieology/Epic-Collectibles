import ContractsStore from "./ContractsStore";
import EpicTokenStore from "./EpicTokenStore";
import AuctionStore from './AuctionStore';

const setupContracts = async () => {
    const contractsStore = new ContractsStore();
    await contractsStore.setup();
    
    const epicTokenStore = new EpicTokenStore(contractsStore);
    // check contract is deployed and reference is available before setup
    if (contractsStore.epicTokenInstance) await epicTokenStore.setup();
 
    // Auction was deployed with the epic token as constructor param in migration script
    const auctionStore = new AuctionStore(contractsStore);
    if(contractsStore.auctionInstance) await auctionStore.setup();

    return {
        contractsStore,
        epicTokenStore,
        auctionStore
      }
}

export default setupContracts;