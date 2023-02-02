// https://blog.csdn.net/lunahaijiao/article/details/108722424 没太懂这个库
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type AccountHookFactory = CryptoHookFactory<string, string>

export type UseAccountHook = ReturnType<AccountHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: CryptoHookFactory<string, string> = (deps) => (params) => {
  const swrRes = useSWR("web3/useAccount", () => {
    // making request to get data
    return params;
  })

  console.log('swrRes', swrRes);
  return swrRes;
}
