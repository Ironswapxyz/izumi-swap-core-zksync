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
  const LiquidityModuleFactory = await deployer.loadArtifact("LiquidityModule");

  const deploymentFee = await deployer.estimateDeployFee(LiquidityModuleFactory, []);
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  if (Number(parsedFee) >= 0.3) {
    console.log('too much fee, revert!')
    return
  }
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const liquidityModule = await deployer.deploy(LiquidityModuleFactory, []);

  //obtain the Constructor Arguments
  console.log("constructor args:" + liquidityModule.interface.encodeDeploy([]));

  // Show the contract info.
  const contractAddress = liquidityModule.address;
  console.log(`${LiquidityModuleFactory.contractName} was deployed to ${contractAddress}`);
}