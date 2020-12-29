var Web3 = require("web3");

const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const GradientToken = artifacts.require("GradientToken");

contract("Gradient token", (accounts) => {
  it("Should make first account an owner", async () => {
    let instance = await GradientToken.deployed();
    let owner = await instance.owner();
    assert.equal(owner, accounts[0]);
  });

  describe("mint", () => {
    it("creates token with specified outer and inner colors", async () => {
      let instance = await GradientToken.deployed();
      let owner = await instance.owner();

      await instance.mint("#ff00dd", "#ddddff", {
        from: accounts[0],
        value: Web3.utils.toWei("5", "ether"),
      });

      let tokenID = await instance.tokenOfOwnerByIndex(owner, 0);
      let gradients = await instance.getGradient(tokenID);
      // TODO figure out why gradients returns extra fields
      expect(gradients).to.include({ outer: "#ff00dd" });
      expect(gradients).to.include({ inner: "#ddddff" });
    });

    it("allows to mint only to owner", async () => {
      let instance = await GradientToken.deployed();
      let other = accounts[1];

      await instance.transferOwnership(other);
      await expectRevert(
        instance.mint("#ff00dd", "#ddddff", {
          from: accounts[0],
          value: Web3.utils.toWei("5", "ether"),
        }),
        "Ownable: caller is not the owner"
      );
    });
  });
});
