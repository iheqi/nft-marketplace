import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers, ethers } from "ethers";
import { setupHooks, Web3Hooks } from "../../hooks/web3/setupHooks";
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export type Web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  provider: providers.Web3Provider | null;
  contract: Contract | null;
}

export type Web3State = {
  isLoading: boolean; // true while loading web3State
  hooks: Web3Hooks;
} & Web3Params

export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({} as any)
  }
}

const NETWORK_ID = 5777;

export const loadContract = async (
  name: string,  // NftMarket
  provider: providers.Web3Provider
): Promise<Contract> => {

  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    )

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }
}