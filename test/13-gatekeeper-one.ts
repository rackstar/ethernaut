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
  const challengeFactory = await ethers.getContractFactory("GatekeeperOne");
  const challengeAddress = await createChallenge(
    "0x9b261b23cE149422DE75907C6ac0C30cEc4e652A"
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory("GatekeeperOneAttacker");
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async () => {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
