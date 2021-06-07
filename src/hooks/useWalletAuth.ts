import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import Debug from "debug";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEagerConnect, useInactiveListener } from "./web3";
import { injected } from "../connectors";
import { api } from "../util/api";

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
  const [valid, setValid] = useState<boolean>(false);
  const { library, account, connector, activate } =
    useWeb3React<Web3Provider>();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return {
    token,
    valid,
    connectWallet: () => {
      setActivatingConnector(injected);
      activate(injected);
    },
    login: async () => {
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
            setValid(true);
            return true;
          }
        }
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    validate: async (token: string) => {
      try {
        // Register a new account or retrieve the nonce for an existing one
        const data = await validate(token);

        if (data.status === "ok") {
          setValid(true);
        } else {
          setValid(false);
        }
      } catch (err) {
        console.error(err);
        setValid(false);
        return false;
      }
    },
  };
};
