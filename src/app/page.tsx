import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CampaignsList from "@/components/campaigns/CampaignsList";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="py-4 mx-auto text-center flex flex-col items-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Marketplace for top class <span className="text-blue-600">asset backed tokens</span></h1>
        <p className="text-2xl font-bold p-8">Search. Buy. Sell.</p>
        <div className='flex flex-col sm:flex-row gap-4 mt-2 mb-6'>
            <Link
              href='/campaigns'
              className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant='ghost'>
              Our quality promise &rarr;
            </Button>
          </div>
          <CampaignsList />
          {/* <CampaignCreatePage /> */}
      </div>
    </MaxWidthWrapper>
  );
}
