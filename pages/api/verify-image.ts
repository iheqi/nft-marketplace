import axios from "axios";
import FormData from "form-data";
import { v4 as uuidv4 } from "uuid";
import { FileReq } from "@_types/nft";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { addressCheckMiddleware, withSession } from "./utils";
import pinataConfig from "../../../pinata.config.js";

export default withSession(async (
  req: NextApiRequest & {session: Session}, 
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const {
      bytes,
      fileName,
      contentType
    } = req.body as FileReq;

    if (!bytes || !fileName || !contentType) {
      return res.status(422).send({message: "Image data are missing"});
    }

    await addressCheckMiddleware(req, res);
    const buffer = Buffer.from(Object.values(bytes));
    const formData = new FormData();

    formData.append(
      "file",
      buffer, {
        contentType,
        filename: fileName + "-" + uuidv4()
      }
    );
    
    // https://docs.pinata.cloud/pinata-api/pinning/pin-file-or-directory
    // 1.同一张图片其他人上传，得到的 IpfsHash 是一样的
    // 2.同一个人上传同一张图片，会返回 isDuplicate: true 
    // 3.可以在网站中移除文件。当然，只是从你的列表中移除展示，文件是永久存储的。(再次上传相同图片时，IpfsHash 也是一样)
    
    const fileRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity,
      headers: {
        // boundary: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        pinata_api_key: pinataConfig.api_key,
        pinata_secret_api_key: pinataConfig.api_secret
      }
    });

    return res.status(200).send(fileRes.data);
  } else {
    return res.status(422).send({message: "Invalid endpoint"});
  }
})