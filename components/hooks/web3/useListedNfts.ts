import { ethers } from "ethers";
import useSWR from "swr";
import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";

type UseListedNftsResponse = {
  buyNft: (token: number, value: number) => Promise<void>
}
type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as Nft[];

      try {
        // 这句报错时，似乎没有抛出，不容易发现
        const coreNfts = await contract!.getAllNftsOnSale();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);
          const metaRes = await fetch(tokenURI); // 出现过cors报错，待复现

          const meta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta
          })
        }

      } catch (error) { 
        console.log("error", error);
      }
      return nfts;
    }
  )

  const buyNft = async (tokenId: number, value: number) => {
    try {
      // ganache bug: 'message': 'invalid remainder', 'code': -32000
      // 重启了一下好了
      const result = await contract?.buyNft(
        tokenId, {
          value: ethers.utils.parseEther(value.toString())
        }
      )
      
      await result?.wait();

      alert("You have bought Nft. See profile page.")
    } catch (e: any) {
      console.error("buyNft error:", e.message);
    }
  }

  return {
    ...swr,
    buyNft,
    data: data || [],
  };
}