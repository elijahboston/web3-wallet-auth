import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React, { ButtonHTMLAttributes, useState } from "react";
import { useWalletAuth } from "../hooks/useWalletAuth";

const Button = (props: React.ButtonHTMLAttributes<HTMLElement>) => (
  <button {...props} style={{ padding: "1rem 2rem", fontSize: "1.2rem" }} />
);

export const Wallet = () => {
  const context = useWeb3React<Web3Provider>();
  const { deactivate, active, error, account } = context;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { login, connectWallet } = useWalletAuth();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Unlike a traditional login process we first need to connect to an available browser wallet. This primary does two things:
        1. Gives us the public wallet address
        2. Provides access to methods of the Ethereum JSON RPC
      */}
      <div id="not-connected">
        {!active && (
          <>
            <Button
              onClick={() => {
                connectWallet();
              }}
            >
              🗝️ Connect Wallet
            </Button>
          </>
        )}
      </div>

      {/* Once connected the user can disconnect their wallet (i.e. revoke access to the API), or continue with the login process. */}
      <div id="connected">
        {(active || error) && (
          <>
            <Button
              onClick={() => {
                deactivate();
              }}
            >
              ❌ Deactivate
            </Button>
          </>
        )}

        {/* In a real application, the user would be provided a JWT on successful login. */}
        {active && (
          <>
            <Button
              disabled={isLoggedIn}
              onClick={async () => {
                const authed = await login();
                setIsLoggedIn(authed);
              }}
            >
              {!isLoggedIn && `🚀 Login`}
              {isLoggedIn && `✅ Authenticated`}
            </Button>
          </>
        )}
      </div>

      {/* If everything goes well we will have sucessfully authenticated the user of this wallet */}
      {active && isLoggedIn && (
        <div id="logged-in">
          <h1>🚀 We have verified that you are the owner of this wallet</h1>
        </div>
      )}
    </div>
  );
};
