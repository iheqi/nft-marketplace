// https://blog.csdn.net/lunahaijiao/article/details/108722424 没太懂这个库
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: CryptoHookFactory = (deps) => (params) => {
  const swrRes = useSWR("web3/useAccount", () => {
    console.log(deps);
    console.log(params);
    // making request to get data
    return params;
  })

  return swrRes;
}

export const useAccount = hookFactory({ethereum: undefined, provider: undefined});