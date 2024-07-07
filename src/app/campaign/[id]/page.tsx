'use server';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import getCampaignInstance from "@/components/contracts/campaign";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import web3 from "@/components/contracts/web3";
import ContributeForm from "@/components/campaigns/ContributeForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import paths from "@/paths";

interface CampaignShowPageProps {
  params: {
    id: string;
  }
}

export default async function CampaignShowPage({ params }: CampaignShowPageProps) {

  const address = params.id;
  console.log('campaign address: ', address);
  const campaign = await getCampaignInstance(address);

  const summary = await campaign.methods.getSummary().call();
  const minimumContribution = summary[0].toString();
  console.log(summary[1]);
  //const balance = summary[1].toString();

  //TODO - check wei, ether etc. conversion
  const balance = web3.utils.fromWei(summary[1], 'gwei') * 10;

  const requestsCount = summary[2].toString();
  const approversCount = summary[3].toString();
  const manager = summary[4];

  console.log('campaign summary: ', typeof minimumContribution, balance, requestsCount);
  
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-wrap">{address}</CardTitle>
              <CardDescription>Address of manager</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{minimumContribution}</CardTitle>
              <CardDescription>Minimum contribution amount (USDC)</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{requestsCount}</CardTitle>
              <CardDescription>Number of requests</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{approversCount}</CardTitle>
              <CardDescription>Number of existing approvers</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{balance}</CardTitle>
              <CardDescription>Balance investment left</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent className="flex w-100%">
            <ContributeForm address={address}/>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
          <Link href={paths.showCampaignRequests(address)}>
            <Button variant="secondary">View requests</Button>
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
