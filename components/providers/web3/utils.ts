import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers, ethers } from "ethers";
import { setupHooks, Web3Hooks } from "../../hooks/web3/setupHooks";
import { Web3Dependencies } from "@_types/hooks";
import { NftMarketContract } from "@_types/nftMarketContract";
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

// 兼容 createDefaultState 时返回的 null 值
// https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}

export type Web3State = {
  isLoading: boolean; // true while loading web3State
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>

export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({isLoading: true} as any)
  }
}

export const createWeb3State = ({
  ethereum, provider, contract, isLoading
}: Web3Dependencies) => {
  return {
    ethereum,
    provider,
    contract: contract as unknown as NftMarketContract,
    isLoading,
    hooks: setupHooks({ethereum, provider, contract, isLoading})
  }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;
const isProd = process.env.NODE_ENV === 'production'
const baseUrl = isProd && process.env.GITHUB_PAGES ? '/nft-marketplace' : ''


export const loadContract = async (
  name: string,  // NftMarket
  provider: providers.Web3Provider
): Promise<Contract> => {

  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`${baseUrl}/contracts/${name}.json`);
  const Artifact = await res.json();

  // 根据合约地址加载合约
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