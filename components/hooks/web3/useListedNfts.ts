import useSWR from "swr";
import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";

type UseListedNftsResponse = {}
type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as any;

      try {
        // 这句报错时，似乎没有抛出，不容易发现
        const coreNfts = await contract!.getAllNftsOnSale() as Nft[];
      } catch (error) { 
        console.log("error", error);
      }
      return nfts;
    }
  )
  return {
    ...swr,
    data: data || [],
  };
}