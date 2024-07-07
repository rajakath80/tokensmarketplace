'use client';

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import * as actions from '@/actions';

interface ContributeFormProps {
  address: string
}

export default function ContributeForm({address} : ContributeFormProps) {
  
  const [formState, action] = useFormState(actions.createContribution.bind(null, address), {errors: {}});
  
  const { pending } = useFormStatus();
  console.log('pending:', pending);
  
  return (
        <form className="flex flex-col gap-4" action={action}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Investment amount</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input name="amount" type="number" placeholder="Investment amount"/>
            <Label className="bg-secondary">USDC</Label>
          </div>
          </div>
          <Button className="buttonVariants()">
            Buy token
          </Button>
        </form>
  );
}
