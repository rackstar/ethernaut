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
  const challengeFactory = await ethers.getContractFactory("MagicNum");
  const challengeAddress = await createChallenge(
    "0x200d3d9Ac7bFd556057224e7aEB4161fED5608D0"
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory("MagicNumAttacker");
  attacker = await attackerFactory.deploy(challenge.address)
});

it("solves the challenge", async () => {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
