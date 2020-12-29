import contract from "truffle-contract";
import getProvider from "./getProvider";
import AuctionArtifact from "../contracts/TokenAuction.json";
import addresses from "../addresses.json";
import getAccounts from "./getAccounts";

const { auctionAddress } = addresses;

export default async function getAuctionContractInstance() {
  const auctionContract = contract(AuctionArtifact);
  const provider = await getProvider();
  auctionContract.setProvider(provider);
  const auctionInstance = await auctionContract.at(auctionAddress);

  return auctionInstance;
}