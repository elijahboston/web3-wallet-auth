import { createHash } from "crypto";

export const generateNonce = () => {
  const hash = createHash("sha256").digest("base64");
  const msg = `To verify your identity, please sign this message containing a unique one-time passcode.\n${hash}`;

  return msg;
};
