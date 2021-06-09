import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React, { ButtonHTMLAttributes, useEffect, useState } from "react";
import { useWalletAuth } from "../hooks/useWalletAuth";
import { useConnector } from "../hooks/useConnector";
import { injected } from "../connectors";

const Button = (props: React.ButtonHTMLAttributes<HTMLElement>) => (
  <button {...props} style={{ padding: "1rem 2rem", fontSize: "1.2rem" }} />
);

export const Wallet = () => {
  const context = useWeb3React<Web3Provider>();
  const { error, active } = context;
  const connectWallet = useConnector(injected);

  const {
    login,
    logout,
    validate,
    isTokenValid,
    isLoggedIn,
    token: fetchedToken,
  } = useWalletAuth();

  const [token, setToken] = useState<string>(fetchedToken);

  // Update local token if login status changes
  useEffect(() => {
    setToken(fetchedToken);
  }, [fetchedToken]);

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
            <Button onClick={() => logout()}>❌ Deactivate</Button>
          </>
        )}

        {/* In a real application, the user would be provided a JWT on successful login. */}
        {active && (
          <>
            <Button disabled={isLoggedIn} onClick={() => login()}>
              {!isLoggedIn && `🚀 Login`}
              {isLoggedIn && `✅ Authenticated`}
            </Button>
          </>
        )}
      </div>

      {/* If everything goes well we will have sucessfully authenticated the user of this wallet */}
      {isLoggedIn && (
        <div id="logged-in">
          <h1>🚀 We have verified that you are the owner of this wallet</h1>
          <h2>
            Token: {isTokenValid && `✅ Valid`}
            {!isTokenValid && `❌ Invalid`}
          </h2>
          <div>
            <textarea
              style={{ width: "100%", margin: "1rem 0", padding: "2rem" }}
              value={token}
              onChange={(e) =>
                e.currentTarget.value !== token &&
                setToken(e.currentTarget.value)
              }
            />
            <Button onClick={() => validate(token)}>Validate token</Button>
            <Button onClick={() => setToken(fetchedToken)}>Reset</Button>
          </div>
        </div>
      )}
    </div>
  );
};
