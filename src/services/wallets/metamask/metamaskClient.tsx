'use client';

import { ContractId, AccountId } from "@hashgraph/sdk";
import { TokenId } from "@hashgraph/sdk/lib/transaction/TransactionRecord";
import { useContext, useEffect } from "react";
import { appConfig } from "../../../config";
import { MetamaskContext } from "@/contexts/MetamaskContext";
import { ContractFunctionParameterBuilder } from "@/services/wallets/contractFunctionParameterBuilder";
import { WalletInterface } from "../walletInterface";
import axios from "axios";

import { Web3 } from 'web3';

import contractsConfig from '@/config/contracts_config.json';
import CampaignFactory from '@/contracts/CampaignFactory.json';

import {
  PrivateKey,
  Client,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  HbarUnit,
} from "@hashgraph/sdk";

const currentNetworkConfig = appConfig.networks.testnet;

const delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

interface IContractIndex {
  [key: number]: any
}

const config: IContractIndex = contractsConfig;

export const switchToHederaNetwork = async (ethereum: any) => {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currentNetworkConfig.chainId }] // chainId must be in hexadecimal numbers
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: `Hedera (${currentNetworkConfig.network})`,
              chainId: currentNetworkConfig.chainId,
              nativeCurrency: {
                name: 'HBAR',
                symbol: 'HBAR',
                decimals: 18
              },
              rpcUrls: [currentNetworkConfig.jsonRpcUrl]
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    console.error(error);
  }
}

let ethereum: any;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  const { eth } = window as any;
  ethereum = eth;
}

const getProvider = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    return new Web3(window.ethereum);
  } else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(currentNetworkConfig.jsonRpcUrl);
    return new Web3(provider);
  }
  // if (!ethereum) {
  //   throw new Error("Metamask is not installed! Go install the extension!");
  // }

  // return new ethers.providers.Web3Provider(ethereum);
}

// returns a list of accounts
// otherwise empty array
export const connectToMetamask = async () => {
  const provider = getProvider();

  // keep track of accounts returned
  let accounts: string[] = []

  try {
    await switchToHederaNetwork(ethereum);
    accounts = await provider.send("eth_requestAccounts", []);
  } catch (error: any) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.warn("Please connect to Metamask.");
    } else {
      console.error(error);
    }
  }

  return accounts;
}

class MetaMaskWallet implements WalletInterface {
  private convertAccountIdToSolidityAddress(accountId: AccountId): string {
    const accountIdString = accountId.evmAddress !== null
      ? accountId.evmAddress.toString()
      : accountId.toSolidityAddress();

    return `0x${accountIdString}`;
  }

  // Purpose: Transfer HBAR
  // Returns: Promise<string>
  // Note: Use JSON RPC Relay to search by transaction hash
  async transferHBAR(toAddress: AccountId, amount: number) {
    const provider = getProvider();
    const signer = await provider.getSigner();
    // build the transaction
    const tx = await signer.populateTransaction({
      to: this.convertAccountIdToSolidityAddress(toAddress),
      value: ethers.utils.parseEther(amount.toString()),
    });
    try {
      // send the transaction
      const { hash } = await signer.sendTransaction(tx);
      await provider.waitForTransaction(hash);

      return hash;
    } catch (error: any) {
      console.warn(error.message ? error.message : error);
      return null;
    }
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'transfer',
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "recipient",
          value: this.convertAccountIdToSolidityAddress(toAddress)
        })
        .addParam({
          type: "uint256",
          name: "amount",
          value: amount
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_FT
    );

    return hash;
  }

  async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
    const provider = getProvider();
    const addresses = await provider.listAccounts();
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'transferFrom',
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "from",
          value: addresses[0]
        })
        .addParam({
          type: "address",
          name: "to",
          value: this.convertAccountIdToSolidityAddress(toAddress)
        })
        .addParam({
          type: "uint256",
          name: "nftId",
          value: serialNumber
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_NFT
    );

    return hash;
  }

  async associateToken(tokenId: TokenId) {
    // send the transaction
    // convert tokenId to contract id
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'associate',
      new ContractFunctionParameterBuilder(),
      appConfig.constants.METAMASK_GAS_LIMIT_ASSOCIATE
    );

    return hash;
  }

  // Purpose: build contract execute transaction and send to hashconnect for signing and execution
  // Returns: Promise<TransactionId | null>
  async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
    console.log("here begin executeContractFunction");
    try {
      const provider = getProvider();

      //const provider = getProvider();
      // const signer = await provider.getSigner();
      // const signerAddress = await signer.getAddress()    // Invoke auto-generated view function with parameters
      
      const abi = [
        `function ${functionName}(${functionParameters.buildAbiFunctionParams()})`
      ];
      const address = `0x${contractId.toSolidityAddress()}`;

      console.log('address: ', address);

      const contract = new provider.eth.Contract(CampaignFactory.abi, address);

      const supply = await contract.methods[functionName].call();
      console.log('Total supply: ', supply);

      const uri = await contract.methods.tokenURI(1).call();
      console.log('Uri : ', uri);


    } catch (error: any) {
      console.log('error: ', error);
    }
    return null;

  }

  // Purpose: build contract execute transaction and send to hashconnect for signing and execution
  // Returns: Promise<TransactionId | null>
  // async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
  //   console.log("here begin executeContractFunction");
  //   const provider = getProvider();
  //   const signer = await provider.getSigner();
  //   const signerAddress = await signer.getAddress()    // Invoke auto-generated view function with parameters
    
  //   const abi = [
  //     `function ${functionName}(${functionParameters.buildAbiFunctionParams()})`
  //   ];
  //   const address = `0x${contractId.toSolidityAddress()}`;

  //   // create contract instance for the contract id
  //   // to call the function, use contract[functionName](...functionParameters, ethersOverrides)
  //   const contract = new ethers.Contract(address, abi, signer);
  //   try {
  //     const txResult = await contract[functionName](
  //       ...functionParameters.buildEthersParams(),
  //       {
  //         gasLimit: gasLimit === -1 ? undefined : gasLimit
  //       }
  //     );

  //     console.log(txResult);

  //     return txResult;
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }

  //   // // Step (F7) in the accompanying tutorial
  //   // // Invoke totalBurnt, with EVM account address parameter
  //   // // --> multiple of 123, depending on how many times this has been invoked
  //   // const scRead2 = await new ContractCallQuery()
  //   // .setContractId(contractId)
  //   // .setGas(100_000)
  //   // .setFunction(
  //   //   functionName,
  //   //   functionParameters.buildHAPIParams()
  //   //     .addAddress(signerAddress),
  //   // )
  //   // .setQueryPayment(new Hbar(2));

  //   // const scRead2Tx = await scRead2.execute(signer);
  //   // const scRead2ReturnValue = scRead2Tx.getUint256();
  //   // console.log('ContractCallQuery #2', scRead2Tx);
  //   // console.log('return value', scRead2ReturnValue.toString());
      
  //   // return scRead2ReturnValue.toString();
  //   return '';
  // }
  

  disconnect() {
    alert("Please disconnect using the Metamask extension.")
  }

  async loadAircraftAssets() {
    return null;
  }

};

export const metamaskWallet = new MetaMaskWallet();

export const MetaMaskClient = () => {
  const { setMetamaskAccountAddress } = useContext(MetamaskContext);
  useEffect(() => {
    // set the account address if already connected
    try {
      const provider = getProvider();
      provider.listAccounts().then((signers) => {
        if (signers.length !== 0) {
          setMetamaskAccountAddress(signers[0]);
        } else {
          setMetamaskAccountAddress("");
        }
      });

      // listen for account changes and update the account address
      ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length !== 0) {
          setMetamaskAccountAddress(accounts[0]);
        } else {
          setMetamaskAccountAddress("");
        }
      });

      // cleanup by removing listeners
      return () => {
        ethereum.removeAllListeners("accountsChanged");
      }
    } catch (error: any) {
      console.error(error.message ? error.message : error);
    }
  }, [setMetamaskAccountAddress]);

  return null;
}

