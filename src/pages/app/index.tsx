import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import dynamic from "next/dynamic";

const WalletDynamic = dynamic<{}>(
  import("../../components/Wallet").then((mod) => mod.Wallet)
);
const getLibrary = (provider: any) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          padding: "2rem",
        }}
      >
        <WalletDynamic />
      </div>
    </Web3ReactProvider>
  );
}
