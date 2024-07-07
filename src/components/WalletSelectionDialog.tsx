import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { connectToMetamask } from "@/services/wallets/metamask/metamaskClient";
import { openWalletConnectModal } from "@/services/wallets/walletconnect/walletConnectClient";
import MetamaskLogo from "@/assets/metamask-logo.svg";
import WalletConnectLogo from "@/assets/walletconnect-logo.svg";


interface WalletSelectionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: (open: boolean) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
  const { onClose, open, setOpen } = props;

  return (
    <Dialog onOpenChange={onClose} open={open}>
        <Button
          onClick={() => {
            openWalletConnectModal()
            setOpen(false);
          }}
        >
          <img
            src={WalletConnectLogo}
            alt='walletconnect logo'
            className='walletLogoImage'
            style={{
              marginLeft: '-6px'
            }}
          />
          WalletConnect
        </Button>
        <Button
          onClick={() => {
            connectToMetamask();
          }}
        >
          <img
            src={MetamaskLogo}
            alt='metamask logo'
            className='walletLogoImage'
            style={{
              padding: '4px 4px 4px 0px'
            }}
          />
          Metamask
        </Button>
    </Dialog>
  );
}
