import { ethers } from "ethers";
import { createContext, FunctionComponent, ReactElement, useContext, useState, useEffect } from "react"
import { createDefaultState, createWeb3State, loadContract, Web3State } from "./utils";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "@_types/nftMarketContract";

function pageReload() {
  window.location.reload();
}

const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
  pageReload();
  // const isLocked =  !(await ethereum._metamask.isUnlocked()); 
  // if (isLocked) { pageReload(); }
}

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", pageReload);
  ethereum.on("disconnect", pageReload);
  ethereum.on("accountsChanged", handleAccount(ethereum));
}

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener("chainChanged", pageReload);
  ethereum?.removeListener("disconnect", pageReload);
  ethereum?.removeListener("accountsChanged", handleAccount); // 上面监听的是 handleAccount 返回的函数，这里 remove 就有问题
}

const Web3Context = createContext<Web3State>(createDefaultState());

type Props = {
  children: ReactElement
}

const Web3Provider: FunctionComponent<Props> = ({children}) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState())

  useEffect(() => {
    async function initWeb3() {
      // 首先需要手动链接：await window.ethereum.enable()
      // 处理没有安装 metamask 的情况
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract =  await loadContract("NftMarket", provider);

        const signer = provider.getSigner();
        const signedContract = contract.connect(signer); // 合约绑定signer

        setTimeout(() => setGlobalListeners(window.ethereum), 500);
        setWeb3Api(createWeb3State({
          ethereum: window.ethereum,
          provider,
          contract: signedContract as unknown as NftMarketContract,
          isLoading: false
        }))
      } catch(e: any) {
        console.error("Please, install web3 wallet", JSON.stringify(e));
        setWeb3Api((api) => {
          // console.log('api', api); // 为默认state
          return createWeb3State({
            ...api as any,
            isLoading: false,
          })
        })
      }
    }

    initWeb3();
    return () => removeGlobalListeners(window.ethereum);
  }, [])

  return (
    <Web3Context.Provider value={web3Api}>
      {children}
    </Web3Context.Provider>
  )
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export function useWeb3() {
  return useContext(Web3Context);
}

export default Web3Provider;