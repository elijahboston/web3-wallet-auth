// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler } from "next";
import UserStore from "../../users-db";
import { toUtf8Bytes, verifyMessage } from "ethers/lib/utils";
import jwt from "jsonwebtoken";
import { generateNonce } from "../../util-api/generateNonce";
import { JWT_SIGNING_KEY } from "../../constants";

const auth: NextApiHandler = (
  req: { body: { publicAddress: string; signature: string } },
  res
) => {
  if (!req.body.publicAddress || !req.body.signature) {
    res.status(201).json({
      status: "error",
      message: "Error - no public address or signature",
    });
  }

  const publicAddress = req.body.publicAddress;
  const signature = req.body.signature;

  // Lookup user
  let user = UserStore.get(req.body.publicAddress);

  if (user) {
    const recoveredAddress = verifyMessage(toUtf8Bytes(user.nonce), signature);
    // Regenerate nonce
    UserStore.update(req.body.publicAddress, { nonce: generateNonce() });
    if (recoveredAddress === publicAddress) {
      // TODO: generate JWT
      const token = jwt.sign(
        {
          sub: req.body.publicAddress,
          channels: [],
        },
        JWT_SIGNING_KEY,
        {
          expiresIn: "24h",
        }
      );
      res.json({ status: "ok", token });
    } else {
      res.status(401).json({ status: "error", message: "Access denied" });
    }
  } else {
    res.status(401).json({
      status: "error",
      message: "Access denied - no user",
    });
  }
};

export default auth;
