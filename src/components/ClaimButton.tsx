"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";
import { useState } from "react";
import {
  getControllerConnector,
  waitForControllerReady,
} from "@/lib/controllerConnector";
import { STARTER_PACK_ID } from "@/lib/meetupNft";
import styles from "./ClaimButton.module.css";

export function ClaimButton() {
  const { connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const starterPackAvailable = connectors.some(
    (connector) => connector.id === "controller",
  );
  const [claimed, setClaimed] = useState(false);
  const [openingStarterPack, setOpeningStarterPack] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClaim = async () => {
    setErrorMessage(null);
    setOpeningStarterPack(true);

    try {
      const controllerConnector = getControllerConnector(connectors);

      await waitForControllerReady(controllerConnector);

      await controllerConnector.controller.openStarterPack(STARTER_PACK_ID, {
        onPurchaseComplete: () => {
          setClaimed(true);
          setErrorMessage(null);
        },
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Starter Pack could not be opened.");
    } finally {
      setOpeningStarterPack(false);
    }
  };

  const label = () => {
    if (openingStarterPack) return "...";
    if (claimed) return "Claimed!";
    return "Claim";
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.btn} ${openingStarterPack ? styles.loading : ""} ${claimed ? styles.done : ""}`}
        onClick={handleClaim}
        disabled={
          openingStarterPack ||
          claimed ||
          !starterPackAvailable
        }
      >
        <span className={styles.outer}>
          <span className={styles.highlight} />
          <span className={styles.label}>{label()}</span>
        </span>
      </button>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      {isConnected && address && (
        <p className={styles.address}>
          {address.slice(0, 6)}...{address.slice(-4)}
          <button
            type="button"
            className={styles.disconnect}
            onClick={() => disconnect()}
          >
            disconnect
          </button>
        </p>
      )}
    </div>
  );
}
