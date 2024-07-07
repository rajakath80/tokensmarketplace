import getCampaignInstance from '@/components/contracts/campaign';
import web3 from '@/components/contracts/web3';
import paths from '@/paths';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createContributionSchema = z.object({
  amount: z.coerce.number(),
});

interface CreateContributionFormState {
  errors: {
    amount?: number,
    _form?: string[]
  }
}

export async function createContribution(address: string, formState: CreateContributionFormState, formData: FormData): Promise<CreateContributionFormState> {
  console.log('here in createContribution fn');
  const result = createContributionSchema.safeParse({
    amount: formData.get('amount'),
  });
  

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  console.log('amount: ', result.data.amount);

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
    console.log('here 2.5');
    const campaigns = await campaign.methods
      .contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(result.data.amount, 'ether')
      });
    console.log('here 3');
  } catch (err: unknown) {
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