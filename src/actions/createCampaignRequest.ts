import getCampaignInstance from '@/components/contracts/campaign';
import web3 from '@/components/contracts/web3';
import { METAMASK_GAS_LIMIT_ASSOCIATE, METAMASK_GAS_LIMIT_TRANSFER_NFT } from '@/config/constants';
import paths from '@/paths';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createContributionSchema = z.object({
  amount: z.coerce.number(),
  description: z.string(),
  recipient: z.string(),
});

interface CreateContributionFormState {
  errors: {
    amount?: number,
    description?: string,
    recipient?: string,
    _form?: string[]
  }
}

export async function createCampaignRequest(address: string, formState: CreateContributionFormState, formData: FormData): Promise<CreateContributionFormState> {
  console.log('insude createCampaign Request action');
  const result = createContributionSchema.safeParse({
    amount: formData.get('amount'),
    recipient: formData.get('recipient'),
    description: formData.get('description'),
  });

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  // const session = await auth();
  // if (!session || !session.user) {
  //   return {
  //     errors: {
  //       _form: ['You must be signed in to do this'],
  //     },
  //   };
  // }
  
  try {
    console.log('here 1');
    const accounts = await web3.eth.getAccounts();
    console.log('here 2');
    const campaign = await getCampaignInstance(address);
    console.log('here 3');
    const method = await campaign.methods.createRequest(result.data.description, result.data.amount, result.data.recipient);
    const estimatedGas = await method.estimateGas({from: accounts[0]});
    console.log('gasEstimate: ', estimatedGas);
    const campaigns = await campaign.methods
      .createRequest(result.data.description, result.data.amount, result.data.recipient).send({
        from: accounts[0],
        value: web3.utils.toWei(result.data.amount, 'ether'),
        gas: METAMASK_GAS_LIMIT_ASSOCIATE
      });
    console.log('here 4');
  } catch (err: unknown) {
    console.log('error', err);
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message]
        }
      }
    } else {
      return {
        errors: {
          _form: ['Something went wrong, please try again later.']
        }
      }
    }
  }

  // revalidatePath(paths.topicShow(slug));
  // redirect(paths.postShow(slug, post.id);

  revalidatePath(paths.home());
  redirect(paths.home());

  return {
    errors: {},
  };

}