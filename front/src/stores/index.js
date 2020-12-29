import ContractsStore from "./ContractsStore";
import GradientTokenStore from "./GradientTokenStore";

const setupContracts = async () => {
    const contractsStore = new ContractsStore();
    await contractsStore.setup();
    
    const gradientTokenStore = new GradientTokenStore(contractsStore);
    if (contractsStore.gradientTokenInstance) await gradientTokenStore.setup();

    return {
        contractsStore,
        gradientTokenStore
      }
}

export default setupContracts;