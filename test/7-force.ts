import { Contract } from "ethers";
import { TestOptions, setupTest } from "./utils";

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

let attacker: Contract | undefined;

// Setup challenge level instance, eoa, attacker and before/after hooks
(async () => {
  const contractLevel = "0xb6c2Ec883DaAac76D8922519E63f875c2ec65575";
  const contractName = "Force";
  const attackerName = "ForceAttacker";
  const options: TestOptions = { contractName, attackerName };
  ({ attacker } = await setupTest(contractLevel, options));
})();

it("solves the challenge", async () => {
  // send 1 wei and execute attacker selfDestruct to force wei to Force contract
  const txSelfDestruct = await attacker?.selfDestruct({ value: 1 });
  await txSelfDestruct.wait();
});
