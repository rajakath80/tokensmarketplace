import { METAMASK_GAS_LIMIT_TRANSFER_NFT } from "@/config/constants";
import { ContractFunctionParameterBuilder } from "@/services/wallets/contractFunctionParameterBuilder";
// import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { ContractId } from "@hashgraph/sdk";
import getFactory from "../contracts/factory";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import paths from "@/paths";
import Link from "next/link";

export default async function CampaignsList() {

  // const { walletInterface } = useWalletInterface();

  async function getDeployedCampaigns() {
    const campaignFactory = await getFactory();

    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
    console.log('getDeployC...', campaigns);

    return campaigns;
  }

  async function mintNft() {
		//const txId = await walletInterface?.executeContractFunction(ContractId.fromString(aircraftContractId), "mint", new ContractFunctionParameterBuilder().addParam({ type: "string", name: "tokenURI", value: "1.jpeg" }), 5000000);
	}

  // const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
  const campaigns = await getDeployedCampaigns();
  //console.log(campaigns);

  function renderCampaigns() {
    const items = campaigns.map((address: string, index: number) => {
      return (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Campaign {index + 1}</CardTitle>
            <CardDescription>{address}</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={`/air/${index + 1}.jpeg`}/>
          </CardContent>
          <CardFooter>
            <Link href={paths.showCampaign(address)}><p className="text-blue-500">View</p></Link>
          </CardFooter>
        </Card>
      )
    });

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {items}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col">
        {/* <h3 className="font-bold">
          Open Campaigns
        </h3> */}
        <Link href={paths.createCampaign()}>
          <Button variant="secondary">
            <PlusCircleIcon className="mr-2"/> Create campaign
          </Button>
        </Link>
      </div>
      <div>
        {renderCampaigns()}
      </div>
      
    </div>
  );
} 