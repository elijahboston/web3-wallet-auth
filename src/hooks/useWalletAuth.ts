import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import Debug from "debug";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEagerConnect, useInactiveListener } from "./web3";
import { injected } from "../connectors";
import { api } from "../util/api";
import { useConnector } from "./useConnector";

const debug = Debug("use-wallet");

const registerAccount = (account: string) =>
  api("register", {
    publicAddress: account,
  });

const loginAccount = (account: string, signature: string) =>
  api("auth", {
    publicAddress: account,
    signature,
  });

const validate = (token: string) =>
  api("validate", {
    token,
  });

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
        const data = await registerAccount(account);

        if (data.nonce) {
          // sign login message
          const msg = `${data.nonce}`;
          const signature = await library.getSigner(account).signMessage(msg);
          const loginResp = await loginAccount(account, signature);

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
