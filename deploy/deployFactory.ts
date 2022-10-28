import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

import { sk } from "../.secret"
import { dev, prod} from '../scripts/deployed'

export default async function (hre: HardhatRuntimeEnvironment) {

  const netType = process.env.NET_TYPE
  const contracts = netType === 'dev' ? dev : prod
  const recv = process.env.RECV
  const fee = process.env.FEE
  console.log('nettype: ', netType)
  console.log('contracts: ', contracts)
  console.log('recv: ', recv)
  console.log('fee: ', fee)

  // Initialize the wallet.
  const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
  const wallet = new Wallet(sk);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const iZiSwapFactory = await deployer.loadArtifact("iZiSwapFactory");

  const args = [
    recv, 
    contracts.swapX2YModule, 
    contracts.swapY2XModule, 
    contracts.liquidityModule, 
    contracts.limitOrderModule, 
    contracts.flashModule, 
    fee
  ]
  console.log('args: ', args)
  const deploymentFee = await deployer.estimateDeployFee(iZiSwapFactory, args);

  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const factory = await deployer.deploy(iZiSwapFactory, args);

  //obtain the Constructor Arguments
  console.log("constructor args:" + factory.interface.encodeDeploy(args));

  // Show the contract info.
  const contractAddress = factory.address;
  console.log(`${iZiSwapFactory.contractName} was deployed to ${contractAddress}`);
}