import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { useEagerConnect, useInactiveListener } from "../hooks/web3";
import { injected } from "../connectors";
import { useWalletAuth } from "../hooks/useWalletAuth";

export const UltraWallet = () => {
  const context = useWeb3React<Web3Provider>();
  const { deactivate, active, error } = context;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { login, connectWallet } = useWalletAuth();

  return (
    <>
      {!active && (
        <button
          onClick={() => {
            connectWallet();
          }}
        >
          Connect Wallet
        </button>
      )}

      {(active || error) && (
        <button
          onClick={() => {
            deactivate();
          }}
        >
          Deactivate
        </button>
      )}

      {active && !isLoggedIn && (
        <button
          onClick={async () => {
            const authed = await login();
            setIsLoggedIn(authed);
          }}
        >
          Login
        </button>
      )}

      {active && isLoggedIn && <div>Welcome!</div>}
    </>
  );
};
