'use client';

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import * as actions from '@/actions';
import { Loader2 } from "lucide-react";

export default function Home() {
  
  const [formState, action] = useFormState(actions.createCampaign, {errors: {}});
  const { pending } = useFormStatus();
  console.log('pending:', pending);
  
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <p className="text-2xl font-bold p-8">New campaign</p>
        <form className="flex flex-col gap-4" action={action}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Minimum contribution</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input name="amount" type="number" placeholder="Enter amount"/>
            <Label className="bg-secondary">USDC</Label>
          </div>
          </div>
          {pending ? 
          <Button className="buttonVariants()" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
        </Button>
          :
          <Button className="buttonVariants()">
            Create
          </Button>
          }
        </form>
      </div>
    </MaxWidthWrapper>
  );
}
