import contract from "truffle-contract";
import getProvider from "./getProvider";
import GradientTokenArtifact from "../contracts/GradientToken.json";
import addresses from "../addresses.json";

const { tokenAddress } = addresses;

export default async function getGradientContractInstance() {
  const gradientTokenContract = contract(GradientTokenArtifact);
  const provider = await getProvider();
  gradientTokenContract.setProvider(provider);
  const gradientTokenInstance = await gradientTokenContract.at(tokenAddress);
  return gradientTokenInstance;
}