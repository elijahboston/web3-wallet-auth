import detectEthereumProvider from "@metamask/detect-provider";
import { useState } from "react";
import Debug from "debug";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const debug = Debug("use-wallet");

const contentTypeHeader = {
  headers: {
    "Content-Type": "application/json",
  },
};
export const auth = (publicAddress?: string, signature?: string) =>
  fetch(`/api/auth/${publicAddress}`, {
    method: "POST",
    body: JSON.stringify({ signature }),
    ...contentTypeHeader,
  }).then((resp) => resp.json());

export const fetchNonce = (publicAddress?: string) =>
  fetch(`/api/auth/${publicAddress}`, {
    method: "GET",
    ...contentTypeHeader,
  }).then((resp) => resp.json());

export const validate = (token?: string) =>
  fetch(`/api/validate`, {
    method: "POST",
    body: JSON.stringify({ token }),
    ...contentTypeHeader,
  }).then((resp) => resp.json());

export const useWalletAuth = () => {
  const [token, setToken] = useState<string | undefined>();
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { library, account, deactivate } = useWeb3React<Web3Provider>();

  return {
    token,
    isTokenValid,
    isLoggedIn,
    logout: () => {
      deactivate();
      setIsLoggedIn(false);
    },
    login: async () => {
      if (!account) {
        return false;
      }
      try {
        // Register a new account or retrieve the nonce for an existing one
        const data = await fetchNonce(account);

        if (data.nonce) {
          // sign login message
          const msg = `${data.nonce}`;
          const signature = await library.getSigner(account).signMessage(msg);
          const loginResp = await auth(account, signature);

          if (loginResp.status === "ok" && loginResp.token) {
            setToken(loginResp.token);
            setIsLoggedIn(true);
            setIsTokenValid(true);
            return false;
          }
        }
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    validate: async (token: string) => {
      if (!token) {
        return false;
      }
      try {
        // Register a new account or retrieve the nonce for an existing one
        const data = await validate(token);

        if (data.status === "ok") {
          setIsTokenValid(true);
          return true;
        } else {
          setIsTokenValid(false);
          return false;
        }
      } catch (err) {
        console.error(err);
        setIsTokenValid(false);
        return false;
      }
    },
  };
};
