// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler } from "next";
import UserStore from "../../users-db";
import { toUtf8Bytes, verifyMessage } from "ethers/lib/utils";
import jwt from "jsonwebtoken";
import { generateNonce } from "../../util-api/generateNonce";
import { JWT_SIGNING_KEY } from "../../constants";

const validate: NextApiHandler = async (
  req: { body: { token: string } },
  res
) => {
  if (!req.body || !req.body.token) {
    res.status(500).json({
      status: "error",
      message: "Error - no token provided",
    });
  }

  return jwt.verify(req.body.token, JWT_SIGNING_KEY, (err, decoded) => {
    if (!err && decoded) {
      res.json({ status: "ok" });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }
  });
};

export default validate;