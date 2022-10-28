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
  const LimitOrderModuleFactory = await deployer.loadArtifact("LimitOrderModule");

  const deploymentFee = await deployer.estimateDeployFee(LimitOrderModuleFactory, []);

  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const limitOrderModule = await deployer.deploy(LimitOrderModuleFactory, []);

  //obtain the Constructor Arguments
  console.log("constructor args:" + limitOrderModule.interface.encodeDeploy([]));

  // Show the contract info.
  const contractAddress = limitOrderModule.address;
  console.log(`${LimitOrderModuleFactory.contractName} was deployed to ${contractAddress}`);
}