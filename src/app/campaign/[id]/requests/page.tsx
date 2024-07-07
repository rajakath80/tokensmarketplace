import MaxWidthWrapper from "@/components/MaxWidthWrapper";

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
import { Button, buttonVariants } from "@/components/ui/button";
import paths from "@/paths";
import getCampaignInstance from '@/components/contracts/campaign';
import { METAMASK_GAS_LIMIT_ASSOCIATE } from "@/config/constants";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CampaignRequestsListProps {
  params: {
    id: string;
  }
}

export default async function CampaignRequestsList({ params }: CampaignRequestsListProps) {
  const address = params.id;
  console.log('CampaignRequests address: ', address);

  let requests;
  try {
    console.log('here 1');
    const accounts = await web3.eth.getAccounts();
    console.log('here 2');
    const campaign = await getCampaignInstance(address);
    console.log('here 3');
    const requestsCount = await campaign.methods
      .getRequestsCount().call();
    console.log('here 4');

    requests = await Promise.all(
      Array(requestsCount).fill(null).map((element, index) => {
        return campaign.methods.requests(index).call()
      })
    );

    console.log('requests:', requests);

  } catch (err: unknown) {
    console.log('error', err);
  }

  function renderRequests() {
    return(
      <Table>
        <TableCaption>A list of campaign requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID1</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Approval count</TableHead>
            <TableHead>Approve</TableHead>
            <TableHead>Finalize</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{request.description}</TableCell>
              <TableCell>{request.value}</TableCell>
              <TableCell>{request.recipient}</TableCell>
              <TableCell>{request.approvalCount}</TableCell>
              <TableCell>{request.complete}</TableCell>
              <TableCell>{request.complete}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <Link href={paths.createCampaignRequests(address)}>
            <Button className="buttonVariants()">
              Create request
            </Button>
          </Link>
        </div>
        <div>
            {renderRequests()}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
