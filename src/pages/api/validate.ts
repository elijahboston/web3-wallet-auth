import { NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import { JWT_SIGNING_KEY } from "../../constants";

const validate: NextApiHandler = async (
  req: { body: { token: string } },
  res
) => {
  if (!req.body || !req.body.token) {
    res.status(401);
  }

  // Check that this token was signed with our key
  return jwt.verify(req.body.token, JWT_SIGNING_KEY, (err, decoded) => {
    if (!err && decoded) {
      res.json({ status: "ok" });
    } else {
      res.json({ status: "bad token" });
    }
  });
};

export default validate;
