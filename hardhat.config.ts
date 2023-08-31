import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "./tasks/index";

dotenv.config(); // load env vars from .env

const { ARCHIVE_URL, MNEMONIC } = process.env;

console.log(ARCHIVE_URL, MNEMONIC)

if (!ARCHIVE_URL)
  throw new Error(
    `ARCHIVE_URL env var not set. Copy .env.template to .env and set the env var`
  );
if (!MNEMONIC)
  throw new Error(
    `MNEMONIC env var not set. Copy .env.template to .env and set the env var`
  );

const accounts = {
  // derive accounts from mnemonic, see tasks/create-key
  mnemonic: MNEMONIC,
};

// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      // old ethernaut compilers
      { version: "0.5.0" },
      { version: "0.6.0" },
      { version: "0.7.3" },
      // new version
      { version: "0.8.21" },
    ],
  },
  networks: {
    sepolia: {
      url: ARCHIVE_URL,
      accounts,
    },
    hardhat: {
      accounts,
      forking: {
        url: ARCHIVE_URL, // =https://sepolia.infura.io/v3/<API_KEY>
        blockNumber: 4177325,
      },
    },
  },
  mocha: {
    timeout: 300 * 1e3,
  },
};

export default config;
