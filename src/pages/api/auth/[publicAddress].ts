import { NextApiHandler } from "next";
import { toUtf8Bytes, verifyMessage } from "ethers/lib/utils";
import jwt from "jsonwebtoken";
import { JWT_SIGNING_KEY } from "../../../constants";
import { createHash } from "crypto";
import { getQueryString } from "../../../util-api/getQueryString";

/**
 * A mock database for storing the user's nonce so we can verify their signature
 */
export const USER_STORE: { publicAddress?: string; nonce?: string } = {};

/**
 * Generate message containing a unique hash code
 * @returns Signed message
 */
const generateNonce = () => {
  const hash = createHash("sha256").digest("base64");
  const msg = `To verify your identity, please sign this message containing a unique one-time passcode.\n${hash}`;

  return msg;
};

/**
 * Handle either generating a one-time message to sign or authenticating a signed message
 * @param req
 * @param res
 */
const auth: NextApiHandler = async (req, res) => {
  const publicAddress = getQueryString(req.query["publicAddress"]);

  // Generate a nonce for this user
  if (req.method === "GET") {
    USER_STORE[publicAddress] = generateNonce();
    res.json({
      nonce: USER_STORE[publicAddress],
    });
  }

  // Verify a signed message
  if (req.method === "POST" && req.body.signature) {
    const nonce = USER_STORE[publicAddress];
    const signature = req.body.signature;

    const recoveredAddress = verifyMessage(toUtf8Bytes(nonce), signature);

    // Regenerate nonce on attempt
    USER_STORE[publicAddress] = generateNonce();

    // Expect that the address that signed the message matches the address
    // attempting to login
    if (recoveredAddress === publicAddress) {
      // Generate a (very weak) token for subsequent requests
      const token = jwt.sign(
        {
          sub: publicAddress,
          channels: [],
        },
        JWT_SIGNING_KEY,
        {
          expiresIn: "24h",
        }
      );
      res.json({ status: "ok", token });
    }
  }

  res.status(401).json({ status: "unauthorized" });
};

export default auth;
