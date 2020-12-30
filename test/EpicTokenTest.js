var Web3 = require("web3");

const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const EpicToken = artifacts.require("EpicToken");

contract("Epic token", (accounts) => {
  it("Should make first account an owner", async () => {
    let instance = await EpicToken.deployed();
    let owner = await instance.owner();
    assert.equal(owner, accounts[0]);
  });

  describe("mint", () => {
    it("creates token with specified outer and inner colors", async () => {
      let instance = await EpicToken.deployed();
      let owner = await instance.owner();

      await instance.mint("#ff00dd", "#ddddff", {
        from: accounts[0],
        value: Web3.utils.toWei("5", "ether"),
      });

      let tokenID = await instance.tokenOfOwnerByIndex(owner, 0);
      let epics = await instance.getEpic(tokenID);
      // TODO figure out why epics returns extra fields
      expect(epics).to.include({ outer: "#ff00dd" });
      expect(epics).to.include({ inner: "#ddddff" });
    });

    it("allows to mint to anyone", async () => {
      let instance = await EpicToken.deployed();
      let originalOwner = await instance.owner();
      let other = accounts[1];

      await instance.transferOwnership(other);

      await instance.mint("#ff00dd", "#ddddff", {
        from: accounts[0],
        value: Web3.utils.toWei("5", "ether"),
      });

      let tokenID = await instance.tokenOfOwnerByIndex( originalOwner, 0);
      let epics = await instance.getEpic(tokenID);
      // TODO figure out why epics returns extra fields
      expect(epics).to.include({ outer: "#ff00dd" });
      expect(epics).to.include({ inner: "#ddddff" });
    });
  });
});
