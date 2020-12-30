import contract from "truffle-contract";
import getProvider from "./getProvider";
import EpicTokenArtifact from "../contracts/EpicToken.json";
import addresses from "../addresses.json";

const { tokenAddress } = addresses;

export default async function getEpicContractInstance() {
  const epicTokenContract = contract(EpicTokenArtifact);
  const provider = await getProvider();
  epicTokenContract.setProvider(provider);
  const epicTokenInstance = await epicTokenContract.at(tokenAddress);
  return epicTokenInstance;
}