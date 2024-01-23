import { expect } from "chai";
import { Contract } from "ethers";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

describe("Preservation", () => {
  let challenge: Contract;
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = "0x7ae0655F0Ee1e7752D7C62493CEa1E69A810e2ed";
    const contractName = "Preservation";
    const attackerName = "PreservationAttacker";
    const options: TestOptions = { contractName, attackerName };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    const challengeOwner = await challenge.owner();

    // attacker contract will:
    // 1. change the timeZone1Library to the PreservationAttackerLib address
    // 2. make the Preservation contract call the PreservationAttackerLib to claim the contract
    await attacker?.attack();

    const newChallengeOwner = await challenge.owner();
    expect(challengeOwner).to.not.equal(newChallengeOwner);
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
