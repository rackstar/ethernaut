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
  const challengeFactory = await ethers.getContractFactory("Preservation");
  const challengeAddress = await createChallenge(
    "0x97E982a15FbB1C28F6B8ee971BEc15C78b3d263F"
  );
  challenge = await challengeFactory.attach(challengeAddress);
  const attackerFactory = await ethers.getContractFactory(
    "PreservationAttacker"
  );
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async () => {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
