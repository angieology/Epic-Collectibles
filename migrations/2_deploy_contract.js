const EpicToken = artifacts.require("EpicToken");
const TokenAuction = artifacts.require("TokenAuction");
const util = require("util");
const fs = require("fs");
const path = require("path");
const writeFile = util.promisify(fs.writeFile);

module.exports = async function(deployer) {
  const epicToken = await deployer.deploy(EpicToken);
  const auctionContract = await deployer.deploy(
    TokenAuction,
    EpicToken.address
  );
  const addresses = {
    tokenAddress: EpicToken.address,
    auctionAddress: TokenAuction.address
  };

  await writeFile(
    path.join(__dirname, "..", "front", "src", "addresses.json"),
    JSON.stringify(addresses)
  );
};