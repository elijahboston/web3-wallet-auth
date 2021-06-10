import { NextApiHandler } from "next";
import { USER_STORE } from "../../user-store";
import { toUtf8Bytes, verifyMessage } from "ethers/lib/utils";
import jwt from "jsonwebtoken";
import { generateNonce } from "../../util-api/generateNonce";
import { JWT_SIGNING_KEY } from "../../constants";

const auth: NextApiHandler = async (
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
  let nonce = USER_STORE[req.body.publicAddress];

  if (nonce) {
    const recoveredAddress = verifyMessage(toUtf8Bytes(nonce), signature);

    // Regenerate nonce on attempt
    USER_STORE[req.body.publicAddress] = generateNonce();

    if (recoveredAddress === publicAddress) {
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
