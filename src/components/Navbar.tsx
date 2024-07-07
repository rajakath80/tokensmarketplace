'use client';

import { useEffect, useState } from 'react';
// import { useWalletInterface } from '../services/wallets/useWalletInterface';
// import { WalletSelectionDialog } from '@/components/WalletSelectionDialog';
import Link from 'next/link';
import paths from '@/paths';
import MaxWidthWrapper from './MaxWidthWrapper';

import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import NavbarHeaderAuth from './NavbarHeaderAuth';
import Image from 'next/image';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  // const { accountId, walletInterface } = useWalletInterface();
  const accountId = 'ACCOUNTID';

  const handleConnect = async () => {
    if (accountId) {
      // walletInterface?.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId])

  return (
    <div className='bg-white sticky z-50 top-0 inset-x-0 h-16'>
      <header className='relative bg-white'>
        <Navbar className="shadow mb-6">
          <NavbarBrand>
            <Link
                href={'/'}
                className='text-3xl md:text-3xl text-white font-semibold'
              >
              <Image
                src='/logo.jpeg'
                alt='company logo'
                width={50}
                height={10}
              />
            </Link>
            <p className='p-2 text-primary font-bold'>Tokens</p>
          </NavbarBrand>
          <NavbarContent justify="start" className='text-primary'>
            <NavbarItem>
              <Link
                href={'/campaigns'}
                className='text-sm md:text-sm font-semibold'
              >
                Buy
              </Link>
            </NavbarItem>
            <NavbarItem className='p-4'>
              Sell
            </NavbarItem>
            <NavbarItem className='p-4'>
              Admin
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="center">
            <NavbarItem>
              <Button color="warning" variant='solid' onClick={handleConnect}>
                {accountId ? `Connected: ${accountId.slice(0, 6) + '...' + accountId.slice(38, 42)}` : 'Connect Wallet'}
              </Button>
            </NavbarItem>
            <NavbarItem>
              <NavbarHeaderAuth />
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      {/* <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} /> */}
      </header>
    </div>
  )
}