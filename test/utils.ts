import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, ContractTransaction, Signer } from "ethers";
import hre, { ethers } from "hardhat";

export type TestData = {
  eoa: Signer;
  challenge: Contract; // challenge contract
  attacker: Contract | undefined;
};

export type TestOptions = {
  contractName?: string; // either contractName or abi must be given
  abi?: any[]; // either contractName or abi must be given
  attackerName?: string;
};

// cached ethernautContract
let ethernautContract: Contract;

const getEthernautContract = async (): Promise<Contract> => {
  if (!ethernautContract) {
    ethernautContract = await ethers.getContractAt(
      getEthernautAbi(),
      getEthernautAddress()
    );
  }
  return ethernautContract;
};
//   const [signer] = await ethers.getSigners();
//   return ethers.getContractAt(ETHERNAUT_ABI, ETHERNAUT_ADDRESS, signer);
// }

export const submitLevel = async (address: string) => {
  try {
    const ethernaut = await getEthernautContract();
    const tx: ContractTransaction = await ethernaut.submitLevelInstance(
      address
    );
    const { logs } = await tx.wait();

    for (const log of logs) {
      try {
        const { name, args } = ethernaut.interface.parseLog(log);
        if (name === "LevelCompletedLog") {
          return true;
        }
      } catch {
        // console.warn("Failed to parse log: ", log);
      }
    }
    console.error("Level NOT completed. No LevelCompletedLog event");
    return false;
  } catch (error) {
    console.error(`submitLevel: ${(error as Error).message}`);
    return false;
  }
};

/**
 * Creates a level instance
 * @param contractLevel
 * @param value
 * @returns level instance address
 */
export const createChallenge = async (
  contractLevel: string,
  value: BigNumber = BigNumber.from("0")
): Promise<HexString> => {
  try {
    const ethernaut = await getEthernautContract();
    // console.log(ethernaut, "calling createLevelInstances")
    let tx: ContractTransaction = await ethernaut.createLevelInstance(
      contractLevel,
      {
        value,
      }
    );
    const { logs, blockNumber } = await tx.wait();
    // FIX: (no logs coming out)
    // queryFilter would be a cleaner way to do logs but couldn't get it to work

    // const filter = ethernaut.filters.LevelInstanceCreatedLog();
    // const levelInstanceCreatedLog = await ethernaut.queryFilter(
    //   filter,
    //   // "LevelInstanceCreatedLog",
    //   blockNumber,
    //   blockNumber - 100
    // );
    // console.log("levelInstanceCreatedLog: ", levelInstanceCreatedLog);
    for (const log of logs) {
      try {
        const { name, args } = ethernaut.interface.parseLog(log);
        if (name === "LevelInstanceCreatedLog" && args.instance) {
          return args.instance;
        }
      } catch {
        console.log("Failed to parse log: ", log);
      }
    }
    console.error(
      "Failed to created level instance. No LevelInstanceCreatedLog event"
    );
    throw new Error("createChallenge failed. No LevelInstanceCreatedLog event");
  } catch (error) {
    const message = error as Error;
    console.error(`createChallenge: ${message}`);
    throw new Error(`createChallenge failed: ${message}`);
  }
};

/**
 * Setups the before and after hooks
 * Before hook - creates the challenge level instance, attacker contract, eoa
 * After hook - submits level and checks if the level was successfully solved
 * @param contractLevel
 * @param options
 * @returns
 */
export const setupTest = (
  contractLevel: HexString,
  options: TestOptions
): Promise<TestData> => {
  return new Promise((resolve, reject) => {
    let eoa: Signer;
    let challenge: Contract; // challenge contract
    let attacker: Contract | undefined;
    let challengeFactory: ContractFactory | undefined;

    before(async () => {
      const { contractName, abi, attackerName } = options;
      const [signers, challengeAddress] = await Promise.all([
        ethers.getSigners(),
        createChallenge(contractLevel),
      ]);

      // EOA
      const [eoa] = signers;

      // Create challenge
      if (contractName) {
        const challengeFactory = await ethers.getContractFactory(contractName);
        challenge = await challengeFactory.attach(challengeAddress);
      } else if (abi) {
        challenge = await ethers.getContractAt(abi, challengeAddress);
      } else {
        reject(
          new Error("Either options.contractName or options.abi must be passed")
        );
      }

      // Create attacker contract if given
      if (attackerName) {
        const attackerFactory = await ethers.getContractFactory(attackerName);
        // Pass the challenge contract address in attacker contract's constructor
        attacker = await attackerFactory.deploy(challenge.address);
      }

      resolve({ eoa, challenge, attacker });
    });

    after(async () => {
      expect(await submitLevel(challenge.address), "level not solved").to.be
        .true;
    });
  });
};

/**
 * Sepolia Ethernaut Address
 */
function getEthernautAddress() {
  return "0xa3e7317E591D5A0F1c605be1b3aC4D2ae56104d6";
}

/**
 * ethernaut.abi - copied from the browser's console ethernaut object (ethernaut website)
 */
function getEthernautAbi() {
  return [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "player",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "instance",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "level",
          type: "address",
        },
      ],
      name: "LevelCompletedLog",
      type: "event",
      signature:
        "0x5038a30b900118d4e513ba62ebd647a96726a6f81b8fda73c21e9da45df5423d",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "player",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "instance",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "level",
          type: "address",
        },
      ],
      name: "LevelInstanceCreatedLog",
      type: "event",
      signature:
        "0x8be8bd7b4324b3d47aca5c3f64cb70e8f645e6fe94da668699951658f6384179",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
      signature:
        "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0",
    },
    {
      inputs: [
        {
          internalType: "contract Level",
          name: "_level",
          type: "address",
        },
      ],
      name: "createLevelInstance",
      outputs: [],
      stateMutability: "payable",
      type: "function",
      payable: true,
      signature: "0xdfc86b17",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "emittedInstances",
      outputs: [
        {
          internalType: "address",
          name: "player",
          type: "address",
        },
        {
          internalType: "contract Level",
          name: "level",
          type: "address",
        },
        {
          internalType: "bool",
          name: "completed",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x4f17afd8",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x8da5cb5b",
    },
    {
      inputs: [
        {
          internalType: "contract Level",
          name: "_level",
          type: "address",
        },
      ],
      name: "registerLevel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x202023d4",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "registeredLevels",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0xcf004695",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x715018a6",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_statProxy",
          type: "address",
        },
      ],
      name: "setStatistics",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0xbe117dfd",
    },
    {
      inputs: [],
      name: "statistics",
      outputs: [
        {
          internalType: "contract IStatistics",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x95e272bd",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_instance",
          type: "address",
        },
      ],
      name: "submitLevelInstance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0xc882d7c2",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0xf2fde38b",
    },
  ];
}
