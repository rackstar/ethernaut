import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  TestOptions,
  setNextBlockBaseFee,
  setupChallenge,
  submitLevel,
} from "./utils";

/**
 * Compute contract address:
 *
 * last 20 bytes of hash of rlp encoding of tx.origin and tx.nonce
 * keccak256(rlp(senderAddress, nonce))[12:31]
 *
 * NOTE:
 * contract's nonce start at 1 not 0
 *
 * @see: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md#specification
 * @see: https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
 */
describe("Recovery", () => {
  let eoa: Signer;
  let challenge: Contract;

  before(async () => {
    const contractLevel = "0xAF98ab8F2e2B24F42C661ed023237f5B7acAB048";
    const contractName = "Recovery";
    const options: TestOptions = { contractName, value: parseEther("0.001") };
    ({ eoa, challenge } = await setupChallenge(contractLevel, options));
  });

  it("solves the challenge", async () => {
    const eoaAddress = await eoa.getAddress();
    // compute the deterministic contract address for the deployer on nonce 1
    const computedContractAddress = ethers.utils.getContractAddress({
      from: challenge.address,
      nonce: 1,
    });
    // call destroy to transfer any assets to the eoa address
    const simpleToken = await ethers.getContractAt(
      "SimpleToken",
      computedContractAddress
    );

    const contractBalanceBefore = await ethers.provider.getBalance(
      simpleToken.address
    );
    const eoaBalanceBefore = await ethers.provider.getBalance(eoaAddress);

    // Set tx fees to 0 to cleanly calculate expected values 
    await setNextBlockBaseFee(0);
    const tx = await simpleToken.destroy(eoaAddress, { maxPriorityFeePerGas: 0 });
    await tx.wait();

    const contractBalanceAfter = await ethers.provider.getBalance(
      simpleToken.address
    );
    const eoaBalanceAfter = await ethers.provider.getBalance(eoaAddress);

    const expectedEoaBalanceAfter = eoaBalanceBefore
      .add(contractBalanceBefore)
    expect(eoaBalanceAfter).to.equal(expectedEoaBalanceAfter);
    expect(contractBalanceAfter.toString()).to.equal("0");
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});
