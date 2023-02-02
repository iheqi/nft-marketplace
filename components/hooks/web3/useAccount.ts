// https://blog.csdn.net/lunahaijiao/article/details/108722424 没太懂这个库
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type AccountHookFactory = CryptoHookFactory<string>

export type UseAccountHook = ReturnType<AccountHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: AccountHookFactory = ({provider, ethereum}) => (params) => {
  const swrRes = useSWR(
    provider ? "web3/useAccount" : null,
    async () => {
      const accounts = await provider!.listAccounts();
      const account = accounts[0];

      if (!account) {
        throw "Cannot retrieve account! Please, connect to web3 wallet."
      }

      return account;
    }, {
      revalidateOnFocus: false, // 避免重新加载
    }
  )
  const connect = async () => {
    try {
      ethereum?.request({method: "eth_requestAccounts"});
      console.log('connect success!');
    } catch(e) {
      console.error(e);
    }
  }

  return {
    ...swrRes,
    connect
  };
}
