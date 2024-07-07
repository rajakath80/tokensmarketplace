import web3 from "./web3";
import type { ContractAbi } from "web3";

import Campaign from '@/contracts/Campaign.json';

//TODO - return type Typescript
export default async function getCampaignInstance(campaignAddress: string) {
  const campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress);
  return campaign;
}