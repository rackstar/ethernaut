import { expect } from "chai";
import { Contract, ContractTransaction, Signer } from "ethers";
import { ethers } from "hardhat";
import { TestOptions, createChallenge, setupTest, submitLevel } from "./utils";

let eoa: Signer;
let challenge: Contract; // challenge contract
let attacker: Contract | undefined;

// Setup challenge level instance, eoa, attacker and before/after hooks
(async () => {
  const contractLevel = "0xA62fE5344FE62AdC1F356447B669E9E6D10abaaF";
  const contractName = "CoinFlip";
  const attackerName = "CoinFlipAttacker";
  const options: TestOptions = { contractName, attackerName };
  ({ eoa, challenge, attacker } = await setupTest(contractLevel, options));
})();

it("solves the challenge", async () => {
  for (let i = 0; i < 10; i++) {
    const tx: ContractTransaction = await attacker?.crystalBall();
    // wait for at least 1 block before guessing again
    await tx.wait(1);
  }
  expect(await challenge.consecutiveWins()).to.equal(10);
});
