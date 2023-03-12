
const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("../keys.json");
require('dotenv').config({ path: './.env.production' });

module.exports = {
  // abi文件输出目录
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          keys.PRIVATE_KEY,
          keys.ALCHEMY_GOERLI_URL
        ),
      network_id: '5',
      networkCheckTimeout: 200000
      // gas: 5500000,
      // gasPrice: 20000000000,
      // confirmations: 2,
      // timeoutBlocks: 200
    }
  },

  compilers: {
    solc: {
      version: "0.8.17" // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
