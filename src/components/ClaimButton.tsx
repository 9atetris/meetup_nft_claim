"use client";

import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { useState } from "react";
import styles from "./ClaimButton.module.css";

export function ClaimButton() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    if (!isConnected) {
      // Cartridgeウォレット接続
      connect({ connector: connectors[0] });
      return;
    }

    // ウォレット接続済み → コントラクトのclaim処理をここに追加
    setClaiming(true);
    try {
      // TODO: コントラクト呼び出し
      // const contract = new Contract(abi, CONTRACT_ADDRESS, account);
      // await contract.claim();
      await new Promise((r) => setTimeout(r, 2000)); // 仮のdelay
      setClaimed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setClaiming(false);
    }
  };

  const label = () => {
    if (claiming) return "...";
    if (claimed) return "Claimed!";
    if (isConnected) return "Claim";
    return "Claim";
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.btn} ${claiming ? styles.loading : ""} ${claimed ? styles.done : ""}`}
        onClick={handleClaim}
        disabled={claiming || claimed}
      >
        <span className={styles.outer}>
          <span className={styles.highlight} />
          <span className={styles.label}>{label()}</span>
        </span>
      </button>

      {isConnected && address && (
        <p className={styles.address}>
          {address.slice(0, 6)}...{address.slice(-4)}
          <button className={styles.disconnect} onClick={() => disconnect()}>
            disconnect
          </button>
        </p>
      )}
    </div>
  );
}
