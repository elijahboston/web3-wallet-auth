import { createHash } from "crypto";

export const generateNonce = () => createHash("sha256").digest("base64");
