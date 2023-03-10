import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession, Session } from "next-iron-session";
import * as util from "ethereumjs-util";
import { NftMarketContract } from "@_types/nftMarketContract";
import contract from "../../public/contracts/NftMarket.json";

const NETWORKS = {
  "5777": "Ganache",
  "5": "Goerli"
}

type NETWORK = typeof NETWORKS;

const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    }
  })
}

const NETWORK_URL = process.env.NODE_ENV === 'production' ?
  process.env.ALCHEMY_GOERLI_URL : "http://127.0.0.1:7545";

export const addressCheckMiddleware = async (req: NextApiRequest & { session: Session}, res: NextApiResponse) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session.get("message-session");
    const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);

    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as NftMarketContract;

    const name = await contract.name();
    console.log('name', name);
    
    let nonce: string | Buffer = 
      "\x19Ethereum Signed Message:\n" +
      JSON.stringify(message).length + 
      JSON.stringify(message);

    nonce = util.keccak(Buffer.from(nonce, "utf-8"));
    const { v, r, s } = util.fromRpcSig(req.body.signature);
    const pubKey = util.ecrecover(util.toBuffer(nonce), v,r,s);
    const addrBuffer = util.pubToAddress(pubKey);
    const address = util.bufferToHex(addrBuffer);

    console.log("address", address);

    // 将签名地址和请求参数地址比较验证，避免有人拿别人的签名来进行请求
    if (address === req.body.address) {
      resolve(message);
    } else {
      reject("Wrong Address");
    }
  })
}