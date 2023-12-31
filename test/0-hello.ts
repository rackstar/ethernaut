import { expect } from "chai";
import { Contract, ContractTransaction } from "ethers";
import { HELLO_LEVEL_ADDRESS } from "./constants";
import { setupChallenge, submitLevel } from "./utils";

describe("Hello", () => {
  let challenge: Contract; // challenge contract

  before(async () => {
    const contractlLevel = HELLO_LEVEL_ADDRESS;
    const options = { abi: getAbi() };
    ({ challenge } = await setupChallenge(contractlLevel, options));
  });

  it("solves the challenge", async () => {
    const infos = await Promise.all([
      challenge.info(),
      challenge.info1(),
      challenge.info2("hello"),
      challenge.infoNum(),
      challenge.info42(),
      challenge.theMethodName(),
      challenge.method7123949(),
    ]);
    console.log(infos.join("\n"));

    const password = await challenge.password();
    console.log(`password = ${password}`);
    // can we somehow get it from constructor arguments? seems to accept a _password
    // const deploymentTx = await eoa.provider.getTransaction("0x13a1170668283617adb31067592b50a3b2c01097ad28a10de08d78ced60215e3")
    // console.log("Tx data:", deploymentTx.data, Buffer.from(deploymentTx.data, "hex").toString("utf8"))

    await challenge.authenticate(password);
  });

  after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
  });
});

/**
 * 0-hello level ethernaut.abi - copied from browser's console ethernaut object (ethernaut website)
 * @returns abi
 */
function getAbi() {
  return [
    {
      inputs: [{ internalType: "string", name: "_password", type: "string" }],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [{ internalType: "string", name: "passkey", type: "string" }],
      name: "authenticate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0xaa613b29",
    },
    {
      inputs: [],
      name: "getCleared",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x3c848d78",
    },
    {
      inputs: [],
      name: "info",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "pure",
      type: "function",
      constant: true,
      signature: "0x370158ea",
    },
    {
      inputs: [],
      name: "info1",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "pure",
      type: "function",
      constant: true,
      signature: "0xd4c3cf44",
    },
    {
      inputs: [{ internalType: "string", name: "param", type: "string" }],
      name: "info2",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "pure",
      type: "function",
      constant: true,
      signature: "0x2133b6a9",
    },
    {
      inputs: [],
      name: "info42",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "pure",
      type: "function",
      constant: true,
      signature: "0x2cbd79a5",
    },
    {
      inputs: [],
      name: "infoNum",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0xc253aebe",
    },
    {
      inputs: [],
      name: "method7123949",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "pure",
      type: "function",
      constant: true,
      signature: "0xf0bc7081",
    },
    {
      inputs: [],
      name: "password",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x224b610b",
    },
    {
      inputs: [],
      name: "theMethodName",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0xf157a1e3",
    },
  ];
}
