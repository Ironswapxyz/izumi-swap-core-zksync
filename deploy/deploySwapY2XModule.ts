import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

import { sk } from "../.secret"

export default async function (hre: HardhatRuntimeEnvironment) {

  // Initialize the wallet.
  const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
  const wallet = new Wallet(sk);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const SwapY2XModuleFactory = await deployer.loadArtifact("SwapY2XModule");

  const deploymentFee = await deployer.estimateDeployFee(SwapY2XModuleFactory, []);

  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const swapY2XModule = await deployer.deploy(SwapY2XModuleFactory, []);

  //obtain the Constructor Arguments
  console.log("constructor args:" + swapY2XModule.interface.encodeDeploy([]));

  // Show the contract info.
  const contractAddress = swapY2XModule.address;
  console.log(`${SwapY2XModuleFactory.contractName} was deployed to ${contractAddress}`);
}