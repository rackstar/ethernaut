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
  const challengeFactory = await ethers.getContractFactory("Denial");
  const challengeAddress = await createChallenge(
    "0xcE1BB92eeb71AF5Fec09D38B0c854d55285f6e04",
    ethers.utils.parseEther("1")
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory("DenialAttacker");
  attacker = await attackerFactory.deploy(challenge.address)
});

it("solves the challenge", async () => {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
