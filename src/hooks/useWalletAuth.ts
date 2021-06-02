import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";
import Debug from "debug";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEagerConnect, useInactiveListener } from "./web3";
import { injected } from "../connectors";

const debug = Debug("use-wallet");

const registerAccount = (account: string) =>
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicAddress: account,
    }),
  }).then((resp) => resp.json());

const loginAccount = (account: string, signature: string) =>
  fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicAddress: account,
      signature,
    }),
  }).then((resp) => resp.json());

export const useWalletAuth = () => {
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
    connectWallet: () => {
      setActivatingConnector(injected);
      activate(injected);
    },
    login: async () => {
      try {
        const data = await registerAccount(account);

        console.log("RESP", data);

        if (data.nonce) {
          console.log("signing", account, data.nonce);
          try {
            // sign login message
            const msg = `${data.nonce}`;

            // @ts-ignore
            // const signature = await window.ethereum.request({
            //   method: "personal_sign",
            //   params,
            // });
            const signature = await library.getSigner(account).signMessage(msg);

            console.log("NONCE CLIENT", data.nonce);

            console.log("signature", signature);

            const loginResp = await loginAccount(account, signature);

            console.log("loginResp", loginResp);

            if (loginResp.status === "ok") {
              return true;
            }
          } catch {
            return false;
          }
        }
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  };
};
