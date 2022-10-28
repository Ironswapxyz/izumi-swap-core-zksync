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
  const SwapX2YModuleFactory = await deployer.loadArtifact("SwapX2YModule");

  const deploymentFee = await deployer.estimateDeployFee(SwapX2YModuleFactory, []);
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  if (Number(parsedFee) >= 0.3) {
    console.log('too much fee, revert!')
    return
  }
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const swapX2YModule = await deployer.deploy(SwapX2YModuleFactory, []);

  //obtain the Constructor Arguments
  console.log("constructor args:" + swapX2YModule.interface.encodeDeploy([]));

  // Show the contract info.
  const contractAddress = swapX2YModule.address;
  console.log(`${SwapX2YModuleFactory.contractName} was deployed to ${contractAddress}`);
}