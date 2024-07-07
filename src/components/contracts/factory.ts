import web3 from '@/components/contracts/web3';
import type { ContractAbi } from "web3";
import CampaignFactory from '@/contracts/CampaignFactory.json';
import { appConfig } from "@/config";
import contractsConfig from '@/config/contracts_config.json';

interface IContractIndex {
  [key: number]: any
}

const config: IContractIndex = contractsConfig;
const currentNetworkConfig = appConfig.networks.testnet;

const campaignFactoryAddress = config[Number(currentNetworkConfig.chainId)].campaignFactory.address;

let campaignFactory;

export default async function getFactory() {
  campaignFactory = await new web3.eth.Contract(CampaignFactory.abi, campaignFactoryAddress);
  return campaignFactory;
}