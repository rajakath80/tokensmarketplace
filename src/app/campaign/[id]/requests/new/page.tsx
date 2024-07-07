'use client';

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import * as actions from '@/actions';

interface CampaignCreateRequestsPageProps {
  params: {
    id: string;
  }
}

export default function CampaignCreateRequestsPage({ params }: CampaignCreateRequestsPageProps) {
  const address = params.id;
  console.log('CampaignRequests PAGE address: ', address);

  const [formState, action] = useFormState(actions.createCampaignRequest.bind(null, address), {errors: {}});
 
  return (
    <div className="font-bold mt-10 mb-6">
      Create a request
      <form className="flex flex-col gap-4 mt-6" action={action}>
        <Label>Description</Label>
        <Input name="description" placeholder="Description"/>
        <Label>Value in USDC</Label>
        <Input name="amount" type="number" placeholder="Enter amount"/>
        <Label>Recipient</Label>
        <Input name="recipient" placeholder="Recipient"/>
        <Button className="buttonVariants()">
          Create
        </Button>
      </form>
      </div>
  );
}
