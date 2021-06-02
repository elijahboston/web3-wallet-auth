// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler } from "next";
import { users } from "../../users-db";
import { toUtf8Bytes, verifyMessage } from "ethers/lib/utils";

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
  let user = users[req.body.publicAddress];

  if (user) {
    const recoveredAddress = verifyMessage(toUtf8Bytes(user.nonce), signature);
    if (recoveredAddress === publicAddress) {
      res.json({ status: "ok" });
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
