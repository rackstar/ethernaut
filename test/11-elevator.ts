import { expect } from "chai";
import { Contract } from "ethers";
import { ELEVATOR_LEVEL_ADDRESS } from "./constants";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

describe("Elevator", () => {
  let challenge: Contract; // challenge contract
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = ELEVATOR_LEVEL_ADDRESS;
    const options: TestOptions = {
      contractName: "Elevator",
      attackerName: "ElevatorAttacker",
    };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    // attacker implements `isLastFloor` returning false initially then true on succeeding calls
    await attacker?.attack(1);
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
