import { NextApiHandler } from "next";
import { generateNonce } from "../../util-api/generateNonce";
import { USER_STORE } from "../../user-store";

const register: NextApiHandler = async (
  req: { body: { publicAddress: string } },
  res
) => {
  if (!req.body.publicAddress) {
    res.status(500);
  }
  const publicAddress = req.body.publicAddress;

  let nonce = USER_STORE[req.body.publicAddress];

  if (!nonce) {
    const nonce = generateNonce();

    USER_STORE[publicAddress] = nonce;

    res.json({ status: "ok", message: `Registered ${publicAddress}`, nonce });
  } else {
    res.send({
      status: "ok",
      message: `Already registered`,
      nonce: nonce,
    });
  }

  res.status(500);
};

export default register;
