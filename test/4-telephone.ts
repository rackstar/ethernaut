import { expect } from "chai";
import { Contract, ContractTransaction, Signer } from "ethers";
import { TELEPHONE_LEVEL_ADDRESS } from "./constants";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

describe("Telephone", () => {
  let eoa: Signer;
  let challenge: Contract; // challenge contract
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = TELEPHONE_LEVEL_ADDRESS;
    const options: TestOptions = {
      contractName: "Telephone",
      attackerName: "TelephoneAttacker",
    };
    ({ eoa, challenge, attacker } = await setupChallenge(
      contractLevel,
      options
    ));
  });

  it("solves the challenge", async () => {
    expect(await challenge.owner()).to.not.equal(await eoa.getAddress());

    await attacker?.attack();

    expect(await challenge.owner()).to.equal(await eoa.getAddress());
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
