"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount, useProvider } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Provider } from "starknet";
import {
  MEETUP_NFT_CONTRACT_ADDRESS,
  MEETUP_NFT_DESCRIPTION,
  MEETUP_NFT_IMAGE_PATH,
  MEETUP_NFT_NAME,
  parseUint256Response,
  shortenAddress,
} from "@/lib/meetupNft";
import styles from "./InventoryPanel.module.css";

const CONTRACT_URL = `https://voyager.online/contract/${MEETUP_NFT_CONTRACT_ADDRESS}`;

type InventoryState =
  | { status: "idle" | "loading" }
  | { status: "ready"; balance: bigint; tokenId: bigint | null }
  | { status: "error"; message: string };

export function InventoryPanel() {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();
  const [inventoryState, setInventoryState] = useState<InventoryState>({
    status: "idle",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadInventory = async () => {
      if (!address || !isConnected || !provider) {
        setInventoryState({ status: "idle" });
        return;
      }

      setInventoryState({ status: "loading" });

      try {
        const rpcProvider = new Provider(provider);
        const balanceResult = await rpcProvider.callContract({
          contractAddress: MEETUP_NFT_CONTRACT_ADDRESS,
          entrypoint: "balance_of",
          calldata: [address],
        });
        const balance = parseUint256Response(balanceResult);

        if (cancelled) {
          return;
        }

        if (balance === BigInt(0)) {
          setInventoryState({
            status: "ready",
            balance,
            tokenId: null,
          });
          return;
        }

        const tokenIdResult = await rpcProvider.callContract({
          contractAddress: MEETUP_NFT_CONTRACT_ADDRESS,
          entrypoint: "get_token_id",
          calldata: [address],
        });
        const tokenId = parseUint256Response(tokenIdResult);

        if (cancelled) {
          return;
        }

        setInventoryState({
          status: "ready",
          balance,
          tokenId,
        });
      } catch (error) {
        console.error(error);

        if (cancelled) {
          return;
        }

        setInventoryState({
          status: "error",
          message: "Could not load collectibles right now.",
        });
      }
    };

    void loadInventory();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected, provider, refreshKey]);

  if (!isConnected || !address) {
    return (
      <section className={styles.panel}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Inventory</p>
          <h2 className={styles.heading}>Collectibles</h2>
          <p className={styles.subcopy}>
            Connect with Cartridge from the Claim screen to view owned meetup
            collectibles here.
          </p>
        </header>

        <div className={styles.emptyState}>
          <h3 className={styles.stateTitle}>No wallet connected</h3>
          <p className={styles.stateBody}>
            Once you connect and claim, this screen can read your collectible
            directly from the NFT contract.
          </p>
          <div className={styles.stateActions}>
            <Link href="/" className={styles.actionLink}>
              Go to Claim
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Inventory</p>
        <h2 className={styles.heading}>Collectibles</h2>
        <p className={styles.subcopy}>
          Connected as {shortenAddress(address)}. This view reads the NFT
          contract on Starknet mainnet and shows any claimed meetup collectible.
        </p>
      </header>

      {inventoryState.status === "loading" && (
        <div className={styles.loadingState}>
          <h3 className={styles.stateTitle}>Checking collectibles...</h3>
          <p className={styles.stateBody}>
            Reading your current balance from the meetup NFT contract.
          </p>
          <div className={styles.loadingBars} aria-hidden="true">
            <div className={styles.loadingBar} />
            <div className={styles.loadingBar} />
            <div className={styles.loadingBar} />
          </div>
        </div>
      )}

      {inventoryState.status === "error" && (
        <div className={styles.errorState}>
          <h3 className={styles.stateTitle}>Could not load collectibles</h3>
          <p className={styles.stateBody}>{inventoryState.message}</p>
          <div className={styles.stateActions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setRefreshKey((current) => current + 1)}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {inventoryState.status === "ready" &&
        inventoryState.balance === BigInt(0) && (
        <div className={styles.emptyState}>
          <h3 className={styles.stateTitle}>No collectibles yet</h3>
          <p className={styles.stateBody}>
            This wallet does not currently hold the meetup NFT. Claim it first,
            then refresh this page to see it here.
          </p>
          <div className={styles.stateActions}>
            <Link href="/" className={styles.actionLink}>
              Go to Claim
            </Link>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setRefreshKey((current) => current + 1)}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {inventoryState.status === "ready" &&
        inventoryState.balance > BigInt(0) && (
        <article className={styles.card}>
          <div className={styles.artPanel}>
            <Image
              src={MEETUP_NFT_IMAGE_PATH}
              alt={MEETUP_NFT_NAME}
              width={220}
              height={220}
              className={styles.art}
              priority
            />
          </div>

          <div className={styles.details}>
            <span className={styles.badge}>Collected</span>

            <div>
              <h3 className={styles.name}>{MEETUP_NFT_NAME}</h3>
              <p className={styles.description}>{MEETUP_NFT_DESCRIPTION}</p>
            </div>

            <div className={styles.grid}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Owner</span>
                <span className={styles.metricValue}>{shortenAddress(address)}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Balance</span>
                <span className={styles.metricValue}>
                  {inventoryState.balance.toString()}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Token ID</span>
                <span className={styles.metricValue}>
                  {inventoryState.tokenId?.toString() ?? "-"}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Contract</span>
                <span className={styles.metricValue}>
                  {shortenAddress(MEETUP_NFT_CONTRACT_ADDRESS)}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setRefreshKey((current) => current + 1)}
              >
                Refresh
              </button>
              <a
                href={CONTRACT_URL}
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionLink} ${styles.actionGhost}`}
              >
                View on Voyager
              </a>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
