import Head from "next/head";
import styles from "../styles/Home.module.css";
import { UltraWallet } from "../../components/UltraWallet";
import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import dynamic from "next/dynamic";

const UltraWalletDynamic = dynamic<{}>(
  import("../../components/UltraWallet").then((mod) => mod.UltraWallet)
);
const getLibrary = (provider: any) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <h1>
        <UltraWalletDynamic />
      </h1>
    </Web3ReactProvider>
  );
}
