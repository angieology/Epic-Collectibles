var Web3 = require("web3");

const {
  expectRevert, // Assertions for transactions that should fail
  expectEvent,
  BN,
} = require("@openzeppelin/test-helpers");

const attributes = ["#ff00dd", 
"#ddddff", "fire", "Coramon",
 "{health: 100, weight: 400, height: 300}",
  "{power: 400, defense: 300}" ]

const EpicToken = artifacts.require("EpicToken");
const TokenAuction = artifacts.require("TokenAuction");

contract("Auction", (accounts) => {
  it("Should accept nft on creation", async () => {
    let nft = await EpicToken.new();
    let auction = await TokenAuction.new(nft.address);
    const nftAddr = await auction.nonFungibleContract();
    assert.equal(nftAddr, nft.address);
  });

  describe("createAuction", () => {
    let nft, auctionContract, tokenId;

    before(async () => {
      nft = await EpicToken.new();
      auctionContract = await TokenAuction.new(nft.address);
      await nft.mint(...attributes, {
        from: accounts[0],
        value: Web3.utils.toWei("5", "ether"),
      });

      tokenId = await nft.tokenByIndex(0);

      await nft.approve(auctionContract.address, tokenId);
      await auctionContract.createAuction(tokenId, 100);
    });

    it("Should take ownership of a token", async () => {
      const tokenOwner = await nft.ownerOf(tokenId);
      assert.equal(tokenOwner, auctionContract.address);
    });

    it("Should create new auction", async () => {
      const auction = await auctionContract.tokenIdToAuction(tokenId);
      assert.equal(auction[0], accounts[0]);
      assert.equal(auction[1].toNumber(), 100);
    });
  });
  describe("Make bids and cancel", () => {
    let nft, auctionContract, tokenId;

    beforeEach(async () => {
      nft = await EpicToken.new();
      auctionContract = await TokenAuction.new(nft.address);
      await nft.mint(...attributes, {
        from: accounts[0],
        value: Web3.utils.toWei("5", "ether"),
      });

      tokenId = await nft.tokenByIndex(0);
      await nft.approve(auctionContract.address, tokenId);
      await auctionContract.createAuction(tokenId, 2);
    });

    it("Should not accept bid if price too low", async () => {
      await expectRevert(
        auctionContract.bid(tokenId, {
          from: accounts[1],
          value: Web3.utils.toWei("1", "wei"),
        }),
        "revert"
      );
    });
    // next two tests are broken, but transfer events show in logs. also not reverting.
    it("Should make a successful bid", async () => {
      const receipt = await auctionContract.bid(tokenId.toString(), {
        from: accounts[1],
        value: Web3.utils.toWei("1", "ether"),
        gas: "2000000",
      });
      // Event assertions can verify that the arguments are the expected ones
      expectEvent(receipt, "Transfer", {
        from: auctionContract.address,
        to: accounts[1],
        tokenId,
      });

      // BN assertions are automatically available via chai-bn (if using Chai)
      // expect(await this.erc20.balanceOf(accounts[0])).to.be.bignumber.equal(value);
    });

    it("Should cancel auction", async () => {
      const receipt = await auctionContract.cancel(tokenId.toString());
      // Event assertions can verify that the arguments are the expected ones
      expectEvent(receipt, "Transfer", {
        from: auctionContract.address,
        to: accounts[0],
        tokenId,
      });
    });
  });
});
