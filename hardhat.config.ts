import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import {apiKey} from "./.secret";

module.exports = {
  zksolc: {
      version: "1.3.5",
      compilerSource: "binary",
      settings: {},
  },
  //defaultNetwork: "zkSyncTestnet",
  defaultNetwork: "zkSyncMainnet",
  networks: {
     zkSyncTestnet: {
        url: "https://testnet.era.zksync.dev",
        ethNetwork: 'https://goerli.infura.io/v3/',
        //ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
	zksync: true,
	veirfyUrl: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification',
     },
     zkSyncMainnet: {
        url: "https://zksync2-mainnet.zksync.io",
	ethNetwork: "https://mainnet.infura.io/v3/",
	zksync: true,
	verifyUrl: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
     }
  },
  solidity: {
      version: "0.8.17",
  },
  etherscan: {
      apiKey: apiKey,
  }
};

