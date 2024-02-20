import { expect } from "chai";
import { Contract } from "ethers";
import { TestOptions, setupChallenge, submitLevel } from "./utils";

/**
 * 39 CODECOPY
 * 60 PUSH1
 * 52 MSTORE
 * F3 RETURN
 * @see https://www.ethervm.io/
 *
 * Initialisation opcodes
 *
 * CodeCopy the runtime opcodes
 * 60 0a // push 10 bytes
 * 60 ?? // offset (runtime opcode position after initilialisation opcodes)
 * 60 0c // push position 12 (because initialisation opcodes are 12 bytes)
 * 39    // codecopy(destOffset,	offset,	length)
 *
 * Return in memory runtime opcodes to EVM
 * 60 0a // push length 10 bytes
 * 60 00 // push offset 0
 * F3    // return(offset, length)
 *
 * Runtime opcodes (return 42)
 *
 * Store 42 first in memory
 * 60 2A // push value 2A (i.e. 42)
 * 60 70 // push offset 70
 * 52    // MSTORE(offset, value)
 *
 * Grab 42 from memory and return
 * 60 20 // push length 20 (i.e. 32 bytes)
 * 60 70 // push offset 70
 * F3    // return(offset, length)
 */

describe("MagicNum", () => {
  let challenge: Contract;
  let attacker: Contract | undefined;

  before(async () => {
    const contractLevel = "0x2132C7bc11De7A90B87375f282d36100a29f97a9";
    const options: TestOptions = {
      contractName: "MagicNum",
      attackerName: "MagicNumAttacker",
    };
    ({ challenge, attacker } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    await attacker?.attack();
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
