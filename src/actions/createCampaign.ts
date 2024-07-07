import getFactory from '@/components/contracts/factory';
import web3 from '@/components/contracts/web3';
import paths from '@/paths';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createCampaignSchema = z.object({
  amount: z.coerce.number(),
});

interface CreateCampaignFormState {
  errors: {
    amount?: number,
    _form?: string[]
  }
}

export async function createCampaign(formState: CreateCampaignFormState, formData: FormData): Promise<CreateCampaignFormState> {
  const result = createCampaignSchema.safeParse({
    amount: formData.get('amount'),
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
    const accounts = await web3.eth.getAccounts();
    const campaignFactory = await getFactory();
    const campaigns = await campaignFactory.methods
      .createCampaign(result.data.amount).send({
        from: accounts[0]
      });
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