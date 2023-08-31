import { expect } from "chai";
import { Contract, ContractTransaction, Signer } from "ethers";
import { TestOptions, setupTest } from "./utils";

let eoa: Signer;
let challenge: Contract; // challenge contract
let attacker: Contract | undefined;

// Setup challenge level instance, eoa, attacker and before/after hooks
(async () => {
  const contractLevel = "0x2C2307bb8824a0AbBf2CC7D76d8e63374D2f8446";
  const contractName = "Telephone";
  const attackerName = "TelephoneAttacker";
  const options: TestOptions = { contractName, attackerName };
  ({ eoa, challenge, attacker } = await setupTest(contractLevel, options));
})();

it("solves the challenge", async () => {
  const tx: ContractTransaction = await attacker?.attack();
  await tx.wait();
  expect(await challenge.owner()).to.equal(await eoa.getAddress());
});
