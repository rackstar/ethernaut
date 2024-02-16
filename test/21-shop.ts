import { expect } from "chai";
import { Contract } from "ethers";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

let challenge: Contract; // challenge contract
let attacker: Contract | undefined;

/**
 * Notice in Shop contract price is called BEFORE it is sold and AFTER it is sold
 * The idea is to give the price it wants before it is sold but give a smaller price once its sold
 */
describe("Shop", () => {
  before(async () => {
    const contractLevel = "0x691eeA9286124c043B82997201E805646b76351a";
    const options: TestOptions = {
      contractName: "Shop",
      attackerName: "ShopAttacker",
    };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    attacker?.attack();
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
