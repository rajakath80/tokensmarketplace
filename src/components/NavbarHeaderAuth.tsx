'use client';

import { useSession } from 'next-auth/react';
import { NavbarItem, Button, Avatar, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import * as actions from '@/actions';

export default function NavbarHeaderAuth() {

  const session = useSession();
  const router = useRouter();

  let authContent: React.ReactNode;
  let isSignedIn = false;
  if (session.status === 'loading') {
    authContent = null;
  } else if (session.data?.user) {
    isSignedIn = true;
    authContent = <Popover placement='left'>
      <PopoverTrigger>
        <Avatar src={session.data?.user?.image || ''}/>
      </PopoverTrigger>
      <PopoverContent>
        <div className='p-4'>
          <form action={actions.signOut}>
            <Button type="submit" color="primary" variant="flat">Sign Out</Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>;
  } else {
    authContent = <div className='flex flex-row'>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="primary" variant="ghost">Sign In</Button>
          </form>
        </NavbarItem>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="primary" variant="solid">Sign Up</Button>
          </form>
        </NavbarItem>
      </div>;
  }
  
  return authContent;
}
