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
  const FlashModuleFactory = await deployer.loadArtifact("FlashModule");

  const deploymentFee = await deployer.estimateDeployFee(FlashModuleFactory, []);

  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const flashModule = await deployer.deploy(FlashModuleFactory, []);

  //obtain the Constructor Arguments
  console.log("constructor args:" + flashModule.interface.encodeDeploy([]));

  // Show the contract info.
  const contractAddress = flashModule.address;
  console.log(`${FlashModuleFactory.contractName} was deployed to ${contractAddress}`);
}