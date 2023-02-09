import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession, contractAddress, addressCheckMiddleware } from "./utils";
import { NftMeta } from "@_types/nft";
import pinataConfig from "../../../pinata.config.js";

export default withSession(async (req: NextApiRequest & {session: Session}, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const {body} = req;
      const nft = body.nft as NftMeta

      if (!nft.name || !nft.description || !nft.attributes) {
        res.status(422).send({message: "Some of the form data are missing!"});
        return;
      }

      await addressCheckMiddleware(req, res);

      // https://docs.pinata.cloud/pinata-api/pinning/pin-json
      const jsonRes = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        pinataMetadata: {
          name: uuidv4()
        },
        pinataContent: nft
      }, {
        headers: {
          pinata_api_key: pinataConfig.api_key,
          pinata_secret_api_key: pinataConfig.api_secret
        }
      });
      console.log('jsonRes', jsonRes);
      return res.status(200).send(jsonRes.data);
    } catch {
      res.status(422).send({message: "Cannot create JSON"});
    } 
  } else if (req.method === "GET") {
    try {
      const message = { contractAddress, id: uuidv4() };
      req.session.set("message-session", message);
      await req.session.save();

      res.json(message);
    } catch {
      res.status(422).send({message: "Cannot generate a message!"});
    }   
  } else {
    res.status(200).json({message: "Invalid api route"});
  }
})