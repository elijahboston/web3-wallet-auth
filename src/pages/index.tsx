import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import Link from "next/link";
import App from "../components/App";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wallet Auth Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Wallet Auth Demo</h1>
        <p></p>
        <App />
      </main>
    </div>
  );
}
