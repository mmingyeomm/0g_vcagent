require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    ogTestnet: {
      url: "https://evmrpc-testnet.0g.ai",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 42069
    }
  }
};
