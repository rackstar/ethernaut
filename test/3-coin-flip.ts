import { expect } from "chai";
import { Contract, ContractTransaction } from "ethers";
import { TestOptions, setupChallenge, submitLevel } from "./utils";
import { COIN_FLIP_LEVEL_ADDRESS } from "./constants";

describe("Coin Flip", () => {
  let challenge: Contract;
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = COIN_FLIP_LEVEL_ADDRESS;
    const options: TestOptions = {
      contractName: "CoinFlip",
      attackerName: "CoinFlipAttacker",
    };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    for (let i = 0; i < 10; i++) {
      const tx: ContractTransaction = await attacker?.crystalBall();
      // wait for at least 1 block before guessing again
      await tx.wait(1);
    }
    expect(await challenge.consecutiveWins()).to.equal(10);
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
