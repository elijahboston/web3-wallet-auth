// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler } from "next";
import { generateNonce } from "../../util-api/generateNonce";
import UserStore, { _data } from "../../users-db";

const register: NextApiHandler = (
  req: { body: { publicAddress: string } },
  res
) => {
  if (!req.body.publicAddress) {
    res
      .status(500)
      .json({ status: "error", message: "Error - no public address" });
  }
  const publicAddress = req.body.publicAddress;

  let user = UserStore.get(req.body.publicAddress);

  // create user
  if (!user) {
    const nonce = generateNonce();

    UserStore.add(publicAddress, { nonce });

    res.json({ status: "ok", message: `Registered ${publicAddress}`, nonce });
  } else {
    res.send({
      status: "ok",
      message: `Already registered`,
      nonce: user.nonce,
    });
  }

  res.status(500).send({ status: "error", message: "Error" });
};

export default register;
