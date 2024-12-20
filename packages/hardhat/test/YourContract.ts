import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  // We define a fixture to reuse the same setup in every test.

  let yourContract: YourContract;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy(owner.address)) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("Deployment", function () {
    // Test if voiting not active on start
    it("Should voitingActive equal false on deploy", async function () {
      expect(await yourContract.votingActive()).to.equal(false);
    });

    // Test giveRightToVote
    it("Should add weight to voiter", async function () {
      await yourContract.giveRightToVote("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      expect((await yourContract.voters("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")).weight).to.equal(1);
    });
  });
});
